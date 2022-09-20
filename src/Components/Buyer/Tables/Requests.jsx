import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from "../../../Material/Toolbar";
import { SmallPrimary } from "../../../Material/Button";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Puller } from "../../../Material/Drawer";
import BuyerService from "../../../Services/Buyer";
import Countdown from "../../Countdown";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { StyledBadge } from "../../../Material/Badge";
import IconButton from '@mui/material/IconButton';

const PRODUCTS = {
    TEAK_SQUARE_LOGS: "Teak Square Logs",
    TEAK_ROUND_LOGS: "Teak Round Logs",
}

const Requests = () => {
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const [rows, setRows] = useState([]);
    const [rowsLoading, setRowsLoading] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const selectRequest = (id) => setSelectedRequestId(id);
    const selectedRequest = rows && rows.find(row => row.id === selectedRequestId);
    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = (open) => (_event) => {
        setOpenDrawer(open);
    };
    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setSelectedRequestId(null);
    }

    const [selectedOffers, setSelectedOffers] = useState(null);
    const handleSelectRequestOffers = (offers) => {
        setSelectedOffers(offers);
        setOpenDrawerOffers(true);
    };
    const [openDrawerOffers, setOpenDrawerOffers] = useState(false);
    const toggleDrawerOffers = (open) => (_event) => { setOpenDrawerOffers(open) };
    const handleCloseDrawerOffers = () => {
        setOpenDrawerOffers(false);
        setSelectedOffers(null);
    };

    const [selectedOffer, setSelectedOffer] = useState(null);
    const handleSelectRequestOffer = (offer) => {
        setSelectedOffer(offer);
        setOpenDrawerOffer(true);
        console.log(offer);
    };
    const [openDrawerOffer, setOpenDrawerOffer] = useState(false);
    const toggleDrawerOffer = (open) => (_event) => { setOpenDrawerOffer(open) };
    const handleCloseDrawerOffer = () => {
        setOpenDrawerOffer(false);
        setSelectedOffer(null);
    };

    const columns = [
        { field: "index", headerName: "Request #", width: 100 },
        { field: "product", headerName: "Product", width: 200 },
        { field: "quantity", headerName: "Quantity", width: 90 },
        { field: "timeLeft", headerName: "TimeLeft", width: 100, renderCell: ({ row }) => <div> <Countdown endDate={row.expiryDate} /> </div> },
        { field: "totalOffers", headerName: "Offers", width: 100, renderCell: ({ row }) => <div><IconButton onClick={() => handleSelectRequestOffers(row.offers)} aria-label="cart"><StyledBadge showZero badgeContent={row.offers.length} color="primary"><RequestQuoteIcon /></StyledBadge></IconButton></div> },
        { field: "action", headerName: "", width: 90, renderCell: ({ row }) => <SmallPrimary onClick={() => selectRequest(row.id)}>View</SmallPrimary> },
    ];

    useEffect(() => {
        selectedRequest && setOpenDrawer(true);
    }, [selectedRequest]);

    const list = () => (
        selectedRequest &&
        <Box
            sx={{ width: "auto", height: "700px" }}
            role="presentation"
            className="drawer-container"
        >
            <div className="drawer-title-container">
                <div>Request Details</div>
                <Puller />
            </div>
            <div className="drawer-body">
                <div className="requests-sections-body">
                    <div className="requests-title-container">
                        <div>Request {selectedRequest.requestNo}</div>
                    </div>
                    <div className="requests-sections-container">
                        <section>
                            <div className="requests-section-title">Product Info</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Product:</span>
                                    <span>{selectedRequest.product}</span>
                                </div>
                                <div>
                                    <span>Species:</span>
                                    <span>{selectedRequest.species}</span>
                                </div>
                                <div>
                                    <span>Types of species:</span>
                                    <span>{selectedRequest.speciesType}</span>
                                </div>
                                <div>
                                    <span>Origin:</span>
                                    <span>{selectedRequest.origin}</span>
                                </div>
                                <div>
                                    <span>Container size:</span>
                                    <span>{selectedRequest.containerSize}</span>
                                </div>
                                <div>
                                    <span>Volume per container:</span>
                                    <span>{selectedRequest.volume} {selectedRequest.volumeUnit}</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Product Specification</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Length:</span>
                                    <span>{selectedRequest.length} {selectedRequest.lengthUnit}</span>
                                </div>
                                {
                                    selectedRequest.product === PRODUCTS.TEAK_SQUARE_LOGS &&
                                    <>
                                        <div>
                                            <span>Thickness:</span>
                                            <span>{selectedRequest.thickness} {selectedRequest.thicknessUnit}</span>
                                        </div>
                                        <div>
                                            <span>Width:</span>
                                            <span>{selectedRequest.width} {selectedRequest.widthUnit}</span>
                                        </div>
                                        <div>
                                            <span>Drying:</span>
                                            <span>{selectedRequest.drying}</span>
                                        </div>
                                    </>
                                }
                                {
                                    selectedRequest.product === PRODUCTS.TEAK_ROUND_LOGS &&
                                    <>
                                        <div>
                                            <span>Diameter:</span>
                                            <span>{selectedRequest.diameter} {selectedRequest.diameterUnit}</span>
                                        </div>
                                    </>
                                }
                                <div>
                                    <span>Quantity:</span>
                                    <span>{selectedRequest.quantity} {selectedRequest.containerSize}</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Product Delivery Information</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Incoterm:</span>
                                    <span>{selectedRequest.terms}</span>
                                </div>
                                <div>
                                    <span>Destination:</span>
                                    <span>{selectedRequest.destination}</span>
                                </div>
                                <div>
                                    <span>Destination Port:</span>
                                    <span>{selectedRequest.port}</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Request Settings</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Validity:</span>
                                    <span>{selectedRequest.validity} days</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Box>
    );

    const listOffers = () => (
        selectedOffers &&
        <Box
            sx={{ width: "auto", height: "700px" }}
            role="presentation"
            className="drawer-container"
        >
            <div className="drawer-title-container">
                <div>View Offers</div>
                <Puller />
            </div>
            <div className="drawer-body">
                <div className="requests-sections-body">
                    {
                        selectedOffers &&
                            selectedOffers.length > 0 ?
                            selectedOffers.map((offer) => {
                                return (
                                    <div className="request-section-offer-container">
                                        <div>Offer {offer.index}</div>
                                        <div>
                                            <SmallPrimary onClick={() => handleSelectRequestOffer(offer)}>View</SmallPrimary>
                                        </div>
                                    </div>
                                )
                            }) : <div>No offers yet</div>
                    }
                </div>
            </div>
        </Box>
    );

    const listOffer = () => (
        selectedOffer &&
        <Box
            sx={{ width: "auto", height: "700px" }}
            role="presentation"
            className="drawer-container"
        >
            <div className="drawer-title-container">
                <div>Offer Details</div>
                <Puller />
            </div>
            <div className="drawer-body">
                <div className="requests-sections-body">
                    <section>
                        <div className="requests-section-title">Incoterm Settings</div>
                        <div>
                            <div className="incoterm-settings-table-container">
                                <table>
                                    <thead>
                                        <tr className="incoterm-setting-heading-container">
                                            <th>Number</th>
                                            {selectedOffer.terms !== "FOB" && <th>Diameter (cm)</th>}
                                            <th>Pieces/container</th>
                                            <th>Price/container</th>
                                            <th>Total price</th>
                                            {selectedOffer.terms === "CIF" && <th>Insurance</th>}
                                            {selectedOffer.terms !== "FOB" && <th>Freight</th>}
                                            <th>Total amount</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            selectedOffer.incotermRows.length > 0 ?
                                                selectedOffer?.incotermRows.map((incoterm, index) =>
                                                    <tr key={index + 1}>
                                                        <td><input disabled value={index + 1} /></td>
                                                        {selectedOffer.terms !== "FOB" && <td><input value={incoterm.diameter} /></td>}
                                                        <td><input value={incoterm.noOfPieces} /></td>
                                                        <td><input value={incoterm.price} /></td>
                                                        <td><input value={incoterm.totalPrice} /></td>
                                                        {selectedOffer.terms === "CIF" && <td><input disabled value={incoterm.insurance} /></td>}
                                                        {selectedOffer.terms !== "FOB" && <td><input disabled value={incoterm.costOfFreight} /></td>}
                                                        <td><input disabled value={incoterm.totalAmount} /></td>
                                                    </tr>
                                                ) :
                                                <tr>
                                                    <td><input disabled value="--" /></td>
                                                    {selectedOffer.terms !== "FOB" && <td><input disabled value="--" /></td>}
                                                    <td><input disabled name="noOfPieces" value="--" /></td>
                                                    <td><input disabled name="price" value="--" /></td>
                                                    <td><input disabled name="totalPrice" value="--" /></td>
                                                    {selectedOffer.terms === "CIF" && <td><input disabled value="--" /></td>}
                                                    {selectedOffer.terms !== "FOB" && <td><input disabled value="--" /></td>}
                                                    <td><input disabled value="--" /></td>
                                                </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="incoterm-settings-table-note-container">Kindly note that all prices are quoted in ($)</div>
                        </div>
                        <div>
                            <div></div>
                        </div>
                    </section>
                </div>
            </div>
        </Box>
    );

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            setRowsLoading(true);
            const buyerService = new BuyerService();
            try {
                const { data, errors } = await buyerService.getRequests(abortController.signal);
                if (errors.length === 0) {
                    const filteredData = data.data.data;
                    await Promise.all(filteredData.map(async (request, index) => {
                        request.index = index + 1;
                        request.id = request._id;
                        request.product = request.quotationProducts[0].product.name;
                        request.terms = request.buyerQuotationIncoterm.label;
                        request.quantity = request.quotationProducts[0].specification.quantity;
                        request.diameter = request?.quotationProducts[0]?.specification?.diameter;
                        request.diameterUnit = request?.quotationProducts[0]?.specification?.diameterUnit;
                        request.drying = request?.quotationProducts[0]?.specification?.drying?.label;
                        request.length = request?.quotationProducts[0]?.specification.length;
                        request.thickness = request?.quotationProducts[0]?.specification.thickness;
                        request.width = request.quotationProducts[0].specification.width;
                        request.lengthUnit = request?.quotationProducts[0]?.specification?.lengthUnit;
                        request.thicknessUnit = request.quotationProducts[0].specification.thicknessUnit;
                        request.widthUnit = request?.quotationProducts[0]?.specification?.widthUnit;
                        request.species = request.quotationProducts[0].product.species.label;
                        request.speciesType = request.quotationProducts[0].product.species.type.label;
                        request.origin = request.quotationProducts[0].product.origin.country;
                        request.containerSize = request.quotationProducts[0].product.supportedShippingContainers[0].label;
                        request.volume = request.quotationProducts[0].product.volume.value;
                        request.volumeUnit = request.quotationProducts[0].product.volume.unit;
                        request.expiryDate = new Date(request.expiryDate).toUTCString().slice(0, 25);
                        request.offers = (await (await buyerService.getOffers(request._id)).data.data.data).map((offer, index) => {
                            offer.index = index + 1;
                            offer.destination = offer.request.destination;
                            offer.incotermRows = offer.buyerQuotationRequestIncoterm;
                            offer.requestNo = offer.request.requestNo;
                            offer.terms = offer.request.buyerQuotationIncoterm.label;
                            offer.expiryDate = new Date(offer.createdOn).toUTCString().slice(0, 16);
                            offer.merchant = {
                                firstName: offer.merchant.firstName,
                                lastName: offer.merchant.lastName,
                                email: offer.merchant.email,
                                mobileNo: offer.merchant.mobileNo,
                                companyName: offer.merchant.companyName,
                                role: offer.merchant.role
                            };
                            return offer;
                        })
                        return 1;
                    }));

                    setRows(filteredData);
                }
            } catch (error) { }
            setRowsLoading(false);
        }

        fetchData();
        return () => abortController.abort();
    }, []);

    return (
        <div className="Requests-Table">
            <div>
                <SwipeableDrawer
                    className="drawer"
                    variant="temporary"
                    anchor="bottom"
                    open={openDrawer}
                    onOpen={toggleDrawer(true)}
                    onClose={handleCloseDrawer}
                    disableBackdropTransition={!iOS} disableDiscovery={iOS}
                >
                    {list()}
                </SwipeableDrawer>

                <SwipeableDrawer
                    className="drawer"
                    variant="temporary"
                    anchor="bottom"
                    open={openDrawerOffers}
                    onOpen={toggleDrawerOffers(true)}
                    onClose={handleCloseDrawerOffers}
                    disableBackdropTransition={!iOS} disableDiscovery={iOS}
                >
                    {listOffers()}
                </SwipeableDrawer>

                <SwipeableDrawer
                    className="drawer"
                    variant="temporary"
                    anchor="bottom"
                    open={openDrawerOffer}
                    onOpen={toggleDrawerOffer(true)}
                    onClose={handleCloseDrawerOffer}
                    disableBackdropTransition={!iOS} disableDiscovery={iOS}
                >
                    {listOffer()}
                </SwipeableDrawer>
            </div>

            <DataGrid
                components={{ Toolbar: Toolbar, LoadingOverlay: LinearProgress }}
                className="standard-table"
                checkboxSelection
                disableSelectionOnClick
                pageSize={10}
                rows={rows}
                columns={columns}
                pagination
                density="compact"
                rowsPerPageOptions={[10, 20, 30, 40, 50]}
                loading={rowsLoading}
            />
        </div>
    )
}

export default Requests;