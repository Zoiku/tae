import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from "../../../Material/Toolbar";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Puller } from "../../../Material/Drawer";
import AdminService from "../../../Services/Admin";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';

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
        description: "Thank you for placing your order.",
    },
    {
        label: "Confirm Order",
        description: "Confirm your order to alert Merchant.",
    },
    {
        label: "Order Approved",
        description: "Your order has been approved and will be processed shortly.",
    },
    {
        label: "Processing",
        description: "Please wait while your order is being processed.",
    },
    {
        label: "Shipped",
        description: "Your order is being shipped.",
    },
    {
        label: "Delivered",
        description: "Your order has been delivered.",
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
    const [paging, setPaging] = useState({
        page: 1,
        size: 10,
        totalCount: 0
    });
    const handlePageChange = (page) => {
        setPaging({ ...paging, page: page + 1 })
    };
    const handlePageSizeChange = (size) => {
        setPaging({ ...paging, size: size })
    };

    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [rows, setRows] = useState([]);
    const [rowsLoading, setRowsLoading] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const selectOrder = (id) => setSelectedOrderId(id);
    const selectedOrder = rows && rows.find(row => row.id === selectedOrderId);
    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = (open) => (_event) => {
        setOpenDrawer(open);
    };
    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        selectOrder(id)
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
        { field: "index", headerName: "Request #", width: 100 },
        { field: "product", headerName: "Product", width: 200 },
        { field: "terms", headerName: "Terms", width: 70 },
        { field: "destination", headerName: "Destination", width: 100 },
        { field: "quantity", headerName: "Quantity", width: 90 },
        { field: "more", headerName: "", width: 30, renderCell: ({ row }) => <div className="simple-center-div"><More id={row.id} /></div> },
    ];

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
            const adminService = new AdminService();
            try {
                const { page, size } = paging;
                const { data, errors } = await adminService.getOrders(abortController.signal, { page, size });
                if (errors.length === 0) {
                    setPaging({ ...paging, totalCount: data.data.totalCount });
                    const filteredData = data.data.data;
                    filteredData.map((order, index) => {
                        order.index = ((paging.size * paging.page) - (paging.size - index)) + 1;
                        order.id = order?._id;
                        order.destination = order?.request?.destination;
                        order.product = order?.request?.quotationProducts[0]?.product.name;
                        order.terms = order?.request?.buyerQuotationIncoterm?.label;
                        order.quantity = order?.request?.quotationProducts[0]?.specification?.quantity;
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
        // eslint-disable-next-line
    }, [paging.page, paging.size]);

    return (
        <div className="Orders-Table">
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
                </Menu>
            </div>

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
                pageSize={paging.size}
                rows={rows}
                columns={columns}
                pagination
                density="compact"
                rowsPerPageOptions={[10, 20, 30, 40, 50]}
                loading={rowsLoading}

                rowCount={paging.totalCount}
                paginationMode="server"
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </div>
    )
}

export default Orders;