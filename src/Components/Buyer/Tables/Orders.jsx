import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from "../../../Material/Toolbar";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useEffect, useReducer } from "react";
import Box from '@mui/material/Box';
import { Puller } from "../../../Material/Drawer";
import BuyerService from "../../../Services/Buyer";
import { useDispatch } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from '@mui/material/IconButton';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Countdown from "../../Countdown";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { INPUTING, SEND_REQUEST, REQUEST_SUCCESSFUL, REQUEST_FAILED } from "../../../Reducers/Actions";
import { INITIAL_STATE, formReducer } from "../../../Reducers/FormReducer";
import { SmallSecondary } from "../../../Material/Button";
import { setAlert } from "../../../Redux/Features/Alert.js"
import Modal from '@mui/material/Modal';
import { inAppStandard, inAppWide } from "../../../Styles/Modal";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

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
        description: "Your order is pending delivery",
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
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [refreshTable, setRefreshTable] = useState(false);
    const rootDispatch = useDispatch();
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
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

    const [openDrawerConfirm, setOpenDrawerConfirm] = useState(false);
    const toggleDrawerConfirm = (open) => (_event) => {
        setOpenDrawerConfirm(open);
    };

    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        selectOrder(id);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (e) => { dispatch({ type: INPUTING, prop: e.target.name, value: e.target.value }); }

    const handleConfirm = async (e) => {
        dispatch({ type: SEND_REQUEST });
        e.preventDefault();
        const { id } = selectedOrder;
        const buyerService = new BuyerService();
        try {
            const { errors } = await buyerService.confirmOrder(id, state.payload);
            if (errors.length === 0) {
                dispatch({ type: REQUEST_SUCCESSFUL });
                setRefreshTable(prev => !prev);
                handleSuccessfullRequest("Successfully confirmed your order", 3000);
                setOpenDrawerConfirm(false);
            } else {
                dispatch({ type: REQUEST_FAILED });
                handleFailedRequest("Could not process your request", 5000);
            }
        } catch (error) { }
    }

    const handleSuccessfullRequest = (message, timeOut) => {
        const payload = {
            severity: "success",
            message,
            timeOut
        }
        rootDispatch(setAlert(payload));
    }

    const handleFailedRequest = (message, timeOut) => {
        const payload = {
            severity: "error",
            message,
            timeOut
        }
        rootDispatch(setAlert(payload));
    }

    const More = ({ id }) => (
        <div>
            <Box sx={{ display: "flex", alignItems: "center", textAlign: "center", position: "relative" }}>
                <Tooltip title="More">
                    <IconButton
                        onClick={event => handleClick(event, id)}
                        size="small"
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <MoreHorizIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </div >
    );

    const columns = [
        { field: "index", headerName: "Order #", width: 100 },
        { field: "product", headerName: "Product", width: 200 },
        { field: "terms", headerName: "Terms", width: 70 },
        { field: "quantity", headerName: "Quantity", width: 90 },
        { field: "timeLeft", headerName: "Time Left", width: 100, renderCell: ({ row }) => <div className="countdown-table-container"> <Countdown endDate={row.expiryDate} /> </div> },
        { field: "status", headerName: "Status", width: 100 },
        { field: "action", headerName: "", width: 30, renderCell: ({ row }) => <div className="simple-center-div"><More id={row.id} /></div> },
    ];

    const list = (stepperOrientation) => (
        selectedOrder &&
        <Box role="presentation" >
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
                                <Stepper activeStep={ORDER_STATUS_STEPS[selectedOrder.status]} orientation={stepperOrientation}>
                                    {steps.map((step) => (
                                        <Step key={step.label}>
                                            <StepLabel>
                                                {step.label}
                                            </StepLabel>
                                            {
                                                stepperOrientation === "vertical" &&
                                                <StepContent>
                                                    <div>{step.description}</div>
                                                    <Box sx={{ mb: 0 }}>
                                                        <div></div>
                                                    </Box>
                                                </StepContent>
                                            }
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>
                        </div>
                    </section>
                </div>
            </div>
        </Box>
    );

    const listConfirm = () => (
        selectedOrder &&
        <Box
            role="presentation"
            component="form"
            onSubmit={handleConfirm}
        >
            <div className="requests-sections-body">
                <div className="orders-confirmation-sections-container">
                    <section>
                        <div>A. Kindly choose one of the payment options below</div>
                        <div>
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="orderPayment"
                                    onChange={handleChange}
                                    required
                                >
                                    <FormControlLabel value="Cash against documents (10%) Escrow deposit required" control={<Radio size="small" />} label="Cash against documents (10%) Escrow deposit required" />
                                    <FormControlLabel value="Letter of credit" control={<Radio size="small" />} label="Letter of credit" />
                                    <FormControlLabel value="Bank transfer" control={<Radio size="small" />} label="Bank transfer" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </section>
                    <section>
                        <div>B. Please provide your shipping address below</div>
                        <div>
                            <TextField required sx={{ background: "white" }} multiline rows={3} fullWidth onChange={handleChange} type="text" name="shippingAddress" variant="outlined" />
                        </div>
                    </section>
                    <section className="sales-and-purchase-agreement-container">
                        <div>C. Sales and purchanse agreement</div>
                        <div>
                            <div>Click to open sales and purchase agreement</div>
                            <div>
                                <SmallSecondary type="submit" loading={state.requestState.loading} variant="contained">Confirm Order</SmallSecondary>
                            </div>
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
                const { data, errors } = await buyerService.getOrders(abortController.signal);
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
                <Modal
                    open={openDrawer}
                    onClose={toggleDrawer(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="modal-container"
                >
                    <Box sx={inAppWide}>
                        <div className="modal-title-container">
                            <div>Order Details</div>
                            <div><CloseRoundedIcon onClick={toggleDrawer(false)} /></div>
                        </div>

                        <div className="modal-body">
                            {list("horizontal")}
                        </div>
                    </Box>
                </Modal>
            </div>

            <div>
                <Modal
                    open={openDrawerConfirm}
                    onClose={toggleDrawerConfirm(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="modal-container"
                >
                    <Box sx={inAppWide}>
                        <div className="modal-title-container">
                            <div>Confirm Order</div>
                            <div><CloseRoundedIcon onClick={toggleDrawerConfirm(false)} /></div>
                        </div>

                        <div className="modal-body">
                            {listConfirm()}
                        </div>
                    </Box>
                </Modal>
            </div>

            <div>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <MenuItem onClick={toggleDrawer(true)}>
                        View
                    </MenuItem>
                    {
                        selectedOrder &&
                        selectedOrder.isConfirmed && !selectedOrder.orderPaymentDetails &&
                        <div>
                            <MenuItem onClick={toggleDrawerConfirm(true)}>
                                Confirm
                            </MenuItem>
                        </div>
                    }
                </Menu>
            </div>

            <div>
                <SwipeableDrawer
                    className="drawer-container"
                    variant="temporary"
                    anchor="bottom"
                    open={openDrawer}
                    onOpen={toggleDrawer(true)}
                    onClose={toggleDrawer(false)}
                    disableBackdropTransition={!iOS} disableDiscovery={iOS}
                >
                    <div className="drawer-title-container">
                        <div>Order Details</div>
                        <Puller />
                    </div>

                    <div className="drawer-body">
                        {list("vertical")}
                    </div>
                </SwipeableDrawer>
            </div>

            <div>
                <SwipeableDrawer
                    className="drawer-container"
                    variant="temporary"
                    anchor="bottom"
                    open={openDrawerConfirm}
                    onOpen={toggleDrawerConfirm(true)}
                    onClose={toggleDrawerConfirm(false)}
                    disableBackdropTransition={!iOS} disableDiscovery={iOS}
                >
                    <div className="drawer-title-container">
                        <div>Confirm Order</div>
                        <Puller />
                    </div>

                    <div className="drawer-body">
                        {listConfirm()}
                    </div>
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