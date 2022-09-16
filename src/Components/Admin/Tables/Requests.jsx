import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from "../../../Material/Toolbar";
import { SmallPrimary } from "../../../Material/Button";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Puller } from "../../../Material/Drawer";
import AdminService from "../../../Services/Admin";

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

    const columns = [
        { field: "index", headerName: "Request #", width: 100 },
        { field: "product", headerName: "Product", width: 200 },
        { field: "terms", headerName: "Terms", width: 70 },
        { field: "destination", headerName: "Destination", width: 100 },
        { field: "quantity", headerName: "Quantity", width: 90 },
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

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            setRowsLoading(true);
            const adminService = new AdminService();
            try {
                const { data, errors } = await adminService.getRequests(abortController.signal);
                if (errors.length === 0) {
                    const filteredData = data.data.data;
                    filteredData.map((request, index) => {
                        request.index = index + 1;
                        request.id = request._id;
                        request.product = request.quotationProducts[0].product.name;
                        request.terms = request.buyerQuotationIncoterm.label;
                        request.quantity = request.quotationProducts[0].specification.quantity;
                        request.diameter = request.quotationProducts[0].specification.diameter;
                        request.diameterUnit = request.quotationProducts[0].specification.diameterUnit;
                        request.drying = request?.quotationProducts[0]?.specification?.drying?.label;
                        request.length = request.quotationProducts[0].specification.length;
                        request.thickness = request.quotationProducts[0].specification.thickness;
                        request.width = request.quotationProducts[0].specification.width;
                        request.lengthUnit = request.quotationProducts[0].specification.lengthUnit;
                        request.thicknessUnit = request.quotationProducts[0].specification.thicknessUnit;
                        request.widthUnit = request.quotationProducts[0].specification.widthUnit;
                        request.species = request.quotationProducts[0].product.species.label;
                        request.speciesType = request.quotationProducts[0].product.species.type.label;
                        request.origin = request.quotationProducts[0].product.origin.country;
                        request.containerSize = request.quotationProducts[0].product.supportedShippingContainers[0].label;
                        request.volume = request.quotationProducts[0].product.volume.value;
                        request.volumeUnit = request.quotationProducts[0].product.volume.unit;
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