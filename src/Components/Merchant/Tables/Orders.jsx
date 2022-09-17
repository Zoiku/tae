import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from "../../../Material/Toolbar";
import { SmallPrimary } from "../../../Material/Button";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Puller } from "../../../Material/Drawer";
import MerchantService from "../../../Services/Merchant";
import Countdown from "../../Countdown";
import "../../../Styles/Order.css";

const ORDER_STATUS = {
    RECEIVED: 'RECEIVED',
    CONFIRMED: 'CONFIRMED',
    PAID: "AWAITING PROOF OF PAYMENT",
    APPROVED: "PROOF OF PAYMENT APPROVED",
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
}

const ORDER_STATUS_LEVELS = {
    RECEIVED: 10,
    CONFIRMED: 20,
    PAID: 30,
    APPROVED: 40,
    PROCESSING: 60,
    SHIPPED: 80,
    DELIVERED: 100
}

const ProgressBar = ({ status }) => {
    return (
        <div className="progress-bar-container">
            <div>
                <span>{ORDER_STATUS_LEVELS[status]}% Complete</span>
            </div>
            <div>
                <progress className="order-status-progress" max="100" value={ORDER_STATUS_LEVELS[status]} />
            </div>
        </div>
    )
};

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

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setSelectedOrderId(null);
    }

    const columns = [
        { field: "index", headerName: "Order #", width: 100 },
        { field: "product", headerName: "Product", width: 200 },
        { field: "terms", headerName: "Terms", width: 70 },
        { field: "quantity", headerName: "Quantity", width: 90 },
        { field: "timeLeft", headerName: "TimeLeft", width: 100, renderCell: ({ row }) => <div> <Countdown endDate={row.expiryDate} /> </div> },
        { field: "status", headerName: "Status", width: 90 },
        { field: "action", headerName: "", width: 90, renderCell: ({ row }) => <SmallPrimary onClick={() => selectOrder(row.id)}>View</SmallPrimary> },
    ];

    useEffect(() => {
        selectedOrder && setOpenDrawer(true);
    }, [selectedOrder]);

    const list = () => (
        selectedOrder &&
        <Box
            sx={{ width: "auto", height: "700px" }}
            role="presentation"
            className="drawer-container"
        >
            <div className="drawer-title-container">
                <div>Order Details</div>
                <Puller />
            </div>
            <div className="drawer-body">
                <div className="requests-sections-body">
                    <div className="requests-title-container">
                        <div>Order {selectedOrder.orderNo}</div>
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
                                    <span>Quantity:</span>
                                    <span>{selectedOrder.quantity} {selectedOrder.containerSize}</span>
                                </div>
                                <div>
                                    <span>Requested Date:</span>
                                    <span>{selectedOrder.createdOn}</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Track Order</div>
                            <div className="order-section-body">
                                <div> <ProgressBar status={selectedOrder.status} /> </div>
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
                        order.quantity = order.request.quotationProducts[0].specification.quantity;
                        order.terms = order.request.buyerQuotationIncoterm.label;
                        order.containerSize = order.request.quotationProducts[0].product.supportedShippingContainers[0].label;
                        order.product = order.request.quotationProducts[0].product.name;
                        order.createdOn = new Date(order.createdOn).toUTCString().slice(0, 16);
                        order.expiryDate = new Date(order?.request?.expiryDate).toUTCString().slice(0, 25);
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

export default Orders;