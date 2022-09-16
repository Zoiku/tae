import "../../../Styles/Requests.css";
import "../../../Styles/Pagination.css";
import { useState, useEffect, useRef } from "react";
import MerchantService from "../../../Services/Merchant";
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import { Puller } from "../../../Material/Drawer";
import { SmallSecondary } from "../../../Material/Button";

const PRODUCTS = {
    TEAK_SQUARE_LOGS: "Teak Square Logs",
    TEAK_ROUND_LOGS: "Teak Round Logs",
}

const TYPE = {
    INCREASE: "increase",
    DECREASE: "decrease"
}

const Requests = () => {
    const incotermRef = useRef([]);
    const [state, setState] = useState([]);
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const [rows, setRows] = useState(null);
    const [rowsLoading, setRowsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [paginationCount, setPagination] = useState(null);
    const [incotermRows, setIncotermRows] = useState(1);
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

    const handlePaginationChange = (_event, value) => {
        setPage(value);
        window.scroll(0, 0);
        console.log(`Start from: ${((page * 5) / 5) - 1}`);
    };

    const handleIncotermSize = (type) => {
        if (type === TYPE.INCREASE) {
            setIncotermRows(prev => prev + 1);
        } else if (type === TYPE.DECREASE) {
            setIncotermRows(prev => prev - 1);
        }
    };

    const handleChange = (e, index, _terms) => {
        incotermRef.current[index] = {
            ...incotermRef.current[index],
            [e.target.name]: e.target.value
        }
        setState([...incotermRef.current]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(state);
    }

    useEffect(() => {
        selectedRequest && setOpenDrawer(true);
    }, [selectedRequest]);

    const list = () => (
        selectedRequest &&
        <Box
            component="form"
            sx={{ width: "auto", height: "700px" }}
            role="presentation"
            className="drawer-container"
            onSubmit={handleSubmit}
            autoComplete="off"
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

                        <section>
                            <div className="requests-section-title">Incoterm Settings</div>
                            <div>
                                <div className="incoterm-settings-table-container">
                                    <table>
                                        <thead>
                                            <tr className="incoterm-setting-heading-container">
                                                <th>Number</th>
                                                <th>#</th>
                                                <th>Price per container</th>
                                                <th>Total price</th>
                                                <th>Total amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Array.from(Array(incotermRows)).map((_row, index) =>
                                                    <tr key={index + 1}>
                                                        <td><input required type="number" onChange={(e) => handleChange(e, index, selectRequest.terms)} name="number" value={index + 1} disabled /></td>
                                                        <td><input required type="number" onChange={(e) => handleChange(e, index, selectRequest.terms)} name="piecesPerContainer" /></td>
                                                        <td><input required type="number" onChange={(e) => handleChange(e, index, selectRequest.terms)} name="pricePerContainer" /></td>
                                                        <td><input required type="number" disabled /></td>
                                                        <td><input required type="number" disabled /></td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="handle-incoterm-size-container">
                                <div onClick={() => handleIncotermSize(TYPE.INCREASE)}>add new field</div>
                                {
                                    incotermRows > 1 &&
                                    <div onClick={() => handleIncotermSize(TYPE.DECREASE)}>remove last field</div>
                                }
                            </div>
                        </section>

                        <section>
                            <div>
                                <div className="button-controller"><SmallSecondary type="submit" >Post Quote</SmallSecondary></div>
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
                const { data, errors } = await merchantService.getRequests(abortController.signal);
                if (errors.length === 0) {
                    const { totalCount } = data.data;
                    const newPaginationCount = Math.ceil(totalCount / 5);
                    setPagination(newPaginationCount);
                    const filteredData = data.data.data;
                    filteredData.map((request, index) => {
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
                        return 1;
                    })
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
        <div className="Requests-Tables">
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
            <div>
                {
                    rowsLoading ? <div className="dash-item-loading-container"> <CircularProgress color="inherit" /> </div> :
                        rows ?
                            <div className="requests-section-container">
                                {
                                    rows.slice((((5 * page) / 5) - 1), (((page * 5) - 1))).map((row, index) =>
                                        <section onClick={() => selectRequest(row.id)} key={index}>
                                            <div>Request Number {row.requestNo}</div>
                                            <div>{row.expiryDate}</div>
                                            <div>{row.destination}</div>
                                            <div>Product: {row.product}</div>
                                            <div>Species: {row.species}</div>
                                            <div>Quantity: {row.quantity}</div>
                                        </section>
                                    )}
                                <div className="pagination-container">
                                    <Pagination showFirstButton showLastButton onChange={handlePaginationChange} count={paginationCount} size="large" />
                                </div>
                            </div>
                            : <div className="dash-item-no-data-container">No data</div>
                }
            </div>
        </div>
    );
}

export default Requests;