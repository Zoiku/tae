import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from "../../../Material/Toolbar";
import { SmallPrimary } from "../../../Material/Button";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Puller } from "../../../Material/Drawer";
import MerchantService from "../../../Services/Merchant";

const Orders = () => {
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const [rows, setRows] = useState([]);
    const [rowsLoading, setRowsLoading] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const selectOrder = (id) => setSelectedOrderId(id);
    const selectedOrder = rows && rows.find(row => row.id === selectedOrderId);
    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = (open) => (_event) => {
        setOpenDrawer(open);
    };

    const columns = [
        { field: "index", headerName: "Order #", width: 100 },
        { field: "product", headerName: "Product", width: 200 },
        { field: "terms", headerName: "Terms", width: 70 },
        { field: "quantity", headerName: "Quantity", width: 90 },
        { field: "timeLeft", headerName: "TimeLeft", width: 100, renderCell: () => <div>10hr 10m</div> },
        { field: "status", headerName: "Status", width: 90 },
        { field: "action", headerName: "", width: 90, renderCell: ({ row }) => <SmallPrimary onClick={() => selectOrder(row.id)}>View</SmallPrimary> },
    ];

    const list = () => (
        selectedOrder &&
        <Box
            sx={{ width: "auto", height: "700px" }}
            role="presentation"
            className="drawer-container"
        >
            <div className="drawer-title-container">
                <div>Request {selectedOrder.id}</div>
                <Puller />
            </div>
            <div className="drawer-body">
                <div className="requests-sections-body">
                    <div className="requests-title-container">
                        <div>Date: 22 January, 2022</div>
                    </div>
                    <div className="requests-sections-container">
                        <section>
                            <div className="requests-section-title">Product Info</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Product:</span>
                                    <span>{selectedOrder.product}</span>
                                </div>
                                <div>
                                    <span>Species:</span>
                                    <span>Teak</span>
                                </div>
                                <div>
                                    <span>Types of species:</span>
                                    <span>Teak</span>
                                </div>
                                <div>
                                    <span>Origin:</span>
                                    <span>{selectedOrder.destination}</span>
                                </div>
                                <div>
                                    <span>Container size:</span>
                                    <span>1000 20ft</span>
                                </div>
                                <div>
                                    <span>Volume per container:</span>
                                    <span>13.5 Cubic meters</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Product Specification</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Length:</span>
                                    <span>20cm</span>
                                </div>
                                <div>
                                    <span>Thickness:</span>
                                    <span>2cm</span>
                                </div>
                                <div>
                                    <span>Diameter:</span>
                                    <span>20cm</span>
                                </div>
                                <div>
                                    <span>Quantity:</span>
                                    <span>20cm</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Product Delivery Information</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Incoterm:</span>
                                    <span>{selectedOrder.terms}</span>
                                </div>
                                <div>
                                    <span>Destination:</span>
                                    <span>{selectedOrder.destination}</span>
                                </div>
                                <div>
                                    <span>Destination Port:</span>
                                    <span>Nharva Sheva</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Request Settings</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Validity:</span>
                                    <span>7 days</span>
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
                const { data, errors } = await merchantService.getOrders(abortController.signal);
                if (errors.length === 0) {
                    const filteredData = data.data.data;
                    filteredData.map((order, index) => {
                        order.index = index + 1;
                        order.id = order._id;
                        order.product = order.request.quotationProducts[0].product.name;
                        order.terms = order.request.buyerQuotationIncoterm.label;
                        order.quantity = order.request.quotationProducts[0].specification.quantity;
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
        <div className="Orders-Table">
            <div>
                <SwipeableDrawer
                    className="drawer"
                    variant="temporary"
                    anchor="bottom"
                    open={openDrawer}
                    onOpen={toggleDrawer(true)}
                    onClose={toggleDrawer(false)}
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

export default Orders;