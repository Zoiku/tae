import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from "../../../Material/Toolbar";
import { SmallPrimary } from "../../../Material/Button";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Puller } from "../../../Material/Drawer";
import MerchantService from "../../../Services/Merchant";

const PRODUCTS = {
    TEAK_SQUARE_LOGS: "Teak Square Logs",
    TEAK_ROUND_LOGS: "Teak Round Logs",
}

const Quotations = () => {
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const [rows, setRows] = useState([]);
    const [rowsLoading, setRowsLoading] = useState(false);
    const [selectedQuoteId, setselectedQuoteId] = useState(null);
    const selectQuote = (id) => setselectedQuoteId(id);
    const selectedQuote = rows && rows.find(row => row.id === selectedQuoteId);
    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = (open) => (_event) => {
        setOpenDrawer(open);
    };

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setselectedQuoteId(null);
    }

    const columns = [
        { field: "index", headerName: "Request #", width: 100 },
        { field: "product", headerName: "Product", width: 200 },
        { field: "terms", headerName: "Terms", width: 70 },
        { field: "quantity", headerName: "Quantity", width: 90 },
        { field: "expiryDate", headerName: "Date", width: 100 },
        { field: "timeLeft", headerName: "Time Left", width: 100, renderCell: () => <div>10hr 10m</div> },
        { field: "action", headerName: "", width: 90, renderCell: ({ row }) => <SmallPrimary onClick={() => selectQuote(row.id)}>View</SmallPrimary> },
    ];

    useEffect(() => {
        selectedQuote && setOpenDrawer(true);
    }, [selectedQuote]);

    const list = () => (
        selectedQuote &&
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
                        <div>Request {selectedQuote.requestNo}</div>
                    </div>
                    <div className="requests-sections-container">
                        <section>
                            <div className="requests-section-title">Product Info</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Product:</span>
                                    <span>{selectedQuote.product}</span>
                                </div>
                                <div>
                                    <span>Species:</span>
                                    <span>{selectedQuote.species}</span>
                                </div>
                                <div>
                                    <span>Types of species:</span>
                                    <span>{selectedQuote.speciesType}</span>
                                </div>
                                <div>
                                    <span>Origin:</span>
                                    <span>{selectedQuote.origin}</span>
                                </div>
                                <div>
                                    <span>Container size:</span>
                                    <span>{selectedQuote.containerSize}</span>
                                </div>
                                <div>
                                    <span>Volume per container:</span>
                                    <span>{selectedQuote.volume} {selectedQuote.volumeUnit}</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Product Specification</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Length:</span>
                                    <span>{selectedQuote.length} {selectedQuote.lengthUnit}</span>
                                </div>
                                {
                                    selectedQuote.product === PRODUCTS.TEAK_SQUARE_LOGS &&
                                    <>
                                        <div>
                                            <span>Thickness:</span>
                                            <span>{selectedQuote.thickness} {selectedQuote.thicknessUnit}</span>
                                        </div>
                                        <div>
                                            <span>Width:</span>
                                            <span>{selectedQuote.width} {selectedQuote.widthUnit}</span>
                                        </div>
                                        <div>
                                            <span>Drying:</span>
                                            <span>{selectedQuote.drying}</span>
                                        </div>
                                    </>
                                }
                                {
                                    selectedQuote.product === PRODUCTS.TEAK_ROUND_LOGS &&
                                    <>
                                        <div>
                                            <span>Diameter:</span>
                                            <span>{selectedQuote.diameter} {selectedQuote.diameterUnit}</span>
                                        </div>
                                    </>
                                }
                                <div>
                                    <span>Quantity:</span>
                                    <span>{selectedQuote.quantity} {selectedQuote.containerSize}</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Product Delivery Information</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Incoterm:</span>
                                    <span>{selectedQuote.terms}</span>
                                </div>
                                <div>
                                    <span>Destination:</span>
                                    <span>{selectedQuote.destination}</span>
                                </div>
                                <div>
                                    <span>Destination Port:</span>
                                    <span>{selectedQuote.port}</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Request Settings</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Validity:</span>
                                    <span>{selectedQuote.validity} days</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Box>
    );

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            setRowsLoading(true);
            const merchantService = new MerchantService();
            try {
                const { data, errors } = await merchantService.getQuotes(abortController.signal);
                if (errors.length === 0) {
                    const filteredData = data.data.data;
                    filteredData.map((quote, index) => {
                        quote.index = index + 1;
                        quote.id = quote._id;
                        quote.requestNo = quote.request.requestNo;
                        quote.expiryDate = new Date(quote.request.expiryDate).toUTCString().slice(0, 25);
                        quote.product = quote.request.quotationProducts[0].product.name;
                        quote.terms = quote.request.buyerQuotationIncoterm.label;
                        quote.quantity = quote.request.quotationProducts[0].specification.quantity;
                        quote.diameter = quote.request.quotationProducts[0].specification.diameter;
                        quote.diameterUnit = quote.request.quotationProducts[0].specification.diameterUnit;
                        quote.drying = quote?.request?.quotationProducts[0]?.specification?.drying?.label;
                        quote.length = quote?.request?.quotationProducts[0]?.specification.length;
                        quote.thickness = quote?.request?.quotationProducts[0]?.specification?.thickness;
                        quote.width = quote?.request?.quotationProducts[0]?.specification?.width;
                        quote.lengthUnit = quote?.request?.quotationProducts[0]?.specification.lengthUnit;
                        quote.thicknessUnit = quote?.request?.quotationProducts[0]?.specification.thicknessUnit;
                        quote.widthUnit = quote?.request.quotationProducts[0]?.specification?.widthUnit;
                        quote.species = quote.request.quotationProducts[0].product.species.label;
                        quote.speciesType = quote.request.quotationProducts[0].product.species.type.label;
                        quote.origin = quote.request.quotationProducts[0].product.origin.country;
                        quote.containerSize = quote.request.quotationProducts[0].product.supportedShippingContainers[0].label;
                        quote.volume = quote.request.quotationProducts[0].product.volume.value;
                        quote.volumeUnit = quote.request.quotationProducts[0].product.volume.unit;
                        quote.destination = quote.request.destination;
                        quote.port = quote.request.port;
                        quote.validity = quote.request.validity;
                        return 1;
                    });
                    setRows(filteredData);
                }
            } catch (error) {
                //
            }
            setRowsLoading(false);
        }

        fetchData();
        return () => abortController.abort();
    }, []);

    return (
        <div className="Quotes-Table">
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

export default Quotations;