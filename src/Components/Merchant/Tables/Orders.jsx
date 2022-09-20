import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from "../../../Material/Toolbar";
import { SmallPrimary, SmallSecondary, SmallCancel } from "../../../Material/Button";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Puller } from "../../../Material/Drawer";
import MerchantService from "../../../Services/Merchant";
import Countdown from "../../Countdown";
import "../../../Styles/Order.css";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { useDispatch } from "react-redux";
import { setAlert } from "../../../Redux/Features/Alert.js";

const ORDER_STATUS_LEVELS = {
    RECEIVED: 10,
    CONFIRMED: 20,
    PAID: 30,
    APPROVED: 40,
    PROCESSING: 60,
    SHIPPED: 80,
    DELIVERED: 100
};

const ORDER_STATUS_STEPS = {
    RECEIVED: 0,
    CONFIRMED: 1,
    PAID: 2,
    APPROVED: 3,
    PROCESSING: 4,
    SHIPPED: 5,
    DELIVERED: 6,
};

const steps = [
    {
        label: 'Order placed',
        description: "Thank you for placing your order",
    },
    {
        label: "Confirm Order",
        description: "Confirm your order to alert Merchant",
    },
    {
        label: "Order Approved",
        description: "Your order has been approved and will be processed shortly",
    },
    {
        label: "Processing",
        description: "Please wait while your order is being processed",
    },
    {
        label: "Shipped",
        description: "Your order is being shipped",
    },
    {
        label: "Delivered",
        description: "Your order has been delivered",
    },
];

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
    const [refreshTable, setRefreshTable] = useState(false);
    const rootDispatch = useDispatch();
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

    const handleConfirmOrder = async (id) => {
        const merchantService = new MerchantService();
        try {
            const { errors } = await merchantService.orderConfirmation(id);
            if (errors.length === 0) {
                setRefreshTable(prev => !prev);
                handleSuccessfulRequest("Successfully confirmed your order", 3000);
            } else {
                handleFailedRequest("Could not process your request", 5000);
            }
        } catch (error) { }
    };

    const handleCancelOrder = async (id) => {
        const merchantService = new MerchantService();
        try {
            const { errors } = await merchantService.orderConfirmation(id);
            if (errors.length === 0) {
                setRefreshTable(prev => !prev);
                handleSuccessfulRequest("Successfully cancelled your order", 3000);
            } else {
                handleFailedRequest("Could not process your request", 5000);
            }
        } catch (error) { }
    };

    const handleFailedRequest = (message, timeOut) => {
        const payload = {
            severity: "error",
            message,
            timeOut
        }
        rootDispatch(setAlert(payload));
    };

    const handleSuccessfulRequest = (message, timeOut) => {
        const payload = {
            severity: "success",
            message,
            timeOut
        }
        rootDispatch(setAlert(payload));
    };

    const columns = [
        { field: "index", headerName: "Order #", width: 100 },
        { field: "product", headerName: "Product", width: 200 },
        { field: "terms", headerName: "Terms", width: 70 },
        { field: "quantity", headerName: "Quantity", width: 90 },
        { field: "timeLeft", headerName: "TimeLeft", width: 100, renderCell: ({ row }) => <div> <Countdown endDate={row.expiryDate} /> </div> },
        { field: "status", headerName: "Status", width: 90 },
        {
            field: "action", headerName: "", width: 220,
            renderCell: ({ row }) => row.isConfirmed ?
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}><SmallPrimary onClick={() => selectOrder(row.id)}>View</SmallPrimary></div> :
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <SmallPrimary onClick={() => selectOrder(row.id)}>View</SmallPrimary>
                    <SmallSecondary onClick={() => handleConfirmOrder(row.id)}>Confirm</SmallSecondary>
                    <SmallCancel onClick={() => handleCancelOrder(row.id)}>Cancel</SmallCancel>
                </div>
        },
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
                            <div className="order-section-stepper-container">
                                <Box fullWidth>
                                    <Stepper activeStep={ORDER_STATUS_STEPS[selectedOrder.status]} orientation="vertical">
                                        {steps.map((step) => (
                                            <Step key={step.label}>
                                                <StepLabel>
                                                    {step.label}
                                                </StepLabel>

                                                <StepContent>
                                                    <div>{step.description}</div>
                                                    <Box sx={{ mb: 0 }}>
                                                        <div></div>
                                                    </Box>
                                                </StepContent>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>
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
            } catch (error) { }
            setRowsLoading(false);
        }

        fetchData();
        return () => abortController.abort();
    }, [refreshTable]);

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