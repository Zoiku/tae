import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from "../../../Material/Toolbar";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Puller } from "../../../Material/Drawer";
import AdminService from "../../../Services/Admin";
import { IOSSwitch } from "../../../Material/Switches";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const UsersMerchant = () => {
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [rows, setRows] = useState([]);
    const [rowsLoading, setRowsLoading] = useState(false);
    const [selectedUserId, setSelectedOrderId] = useState(null);
    const selectUser = (id) => setSelectedOrderId(id);
    const selectedUser = rows && rows.find(row => row.id === selectedUserId);
    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = (open) => (_event) => {
        setOpenDrawer(open);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const More = () => (
        <div>
            <Box sx={{ display: "flex", alignItems: "center", textAlign: "center", position: "relative" }}>
                <Tooltip title="More">
                    <IconButton
                        onClick={handleClick}
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
        { field: "index", headerName: "Number", width: 100 },
        { field: "fullName", headerName: "Full Name", width: 200 },
        { field: "email", headerName: "Email", width: 70 },
        { field: "businessType", headerName: "Business Type", width: 70 },
        { field: "status", headerName: "Status", width: 90, renderCell: ({ row }) => row.status ? "Verified" : "Unverified" },
        { field: "activated", headerName: "Activated", width: 90, renderCell: ({ row }) => <IOSSwitch checked={row.activated} /> },
        { field: "more", headerName: "", width: 30, renderCell: () => <div className="simple-center-div"><More /></div> },
    ];

    const list = () => (
        selectedUser &&
        <Box
            sx={{ width: "auto", height: "700px" }}
            role="presentation"
            className="drawer-container"
        >
            <div className="drawer-title-container">
                <div>Request {selectedUser.id}</div>
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
                                    <span>{selectedUser.product}</span>
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
                                    <span>{selectedUser.destination}</span>
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
                                    <span>{selectedUser.terms}</span>
                                </div>
                                <div>
                                    <span>Destination:</span>
                                    <span>{selectedUser.destination}</span>
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
            const adminService = new AdminService();
            try {
                const { data, errors } = await adminService.getMerchants(abortController.signal);
                if (errors.length === 0) {
                    const filteredData = data.data.data;
                    filteredData.map((user, index) => {
                        user.index = index + 1;
                        user.fullName = `${user.user.firstName} ${user.user.lastName}`;
                        user.email = user.user.email;
                        user.businessType = user.type.label;
                        user.status = user.user.isVerified;
                        user.activated = user.user.enabled;
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
        <div className="UsersMerchant-Table">
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
                    <MenuItem>
                        View
                    </MenuItem>
                    <MenuItem>
                        Flag User
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

export default UsersMerchant;