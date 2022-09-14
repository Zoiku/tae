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
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import { StyledBadge } from "../../../Material/Avatar";

const UsersBuyer = () => {
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
    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        selectUser(id);
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
        { field: "index", headerName: "Number", width: 100 },
        { field: "fullName", headerName: "Full Name", width: 200 },
        { field: "email", headerName: "Email", width: 70 },
        { field: "businessType", headerName: "Business Type", width: 70 },
        { field: "status", headerName: "Status", width: 90, renderCell: ({ row }) => row.status ? "Verified" : "Unverified" },
        { field: "activated", headerName: "Activated", width: 90, renderCell: ({ row }) => <IOSSwitch checked={row.activated} /> },
        { field: "more", headerName: "", width: 30, renderCell: ({ row }) => <div className="simple-center-div"><More id={row.id} /></div> },
    ];

    const list = () => (
        selectedUser &&
        <Box
            sx={{ width: "auto", height: "700px" }}
            role="presentation"
            className="drawer-container"
        >
            <div className="drawer-title-container">
                <div>User Information</div>
                <Puller />
            </div>
            <div className="drawer-body">
                <div className="users-sections-body">
                    <div className="users-title-container">
                        <div></div>
                    </div>
                    <div className="users-sections-container">
                        <div className="user-profile-container">
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar className="user-avatar" alt="User" src="/" />
                            </StyledBadge>
                            <div className="user-short-desc-container">
                                <div>{selectedUser.fullName}</div>
                                <div>{selectedUser.email}</div>
                            </div>
                        </div>

                        <div className="user-profile-sections-container Admin-Settings-Page">
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { width: '100%', margin: "50px 0" },
                                }}
                                autoComplete="off"
                            >
                                <section>
                                    <div className="user-profile-section-title">Personal Details</div>
                                    <div className="form-controller-input-duo form-controller">
                                        <TextField disabled value={selectedUser.firstName} fullWidth label="Full Name" variant="standard" />
                                        <TextField disabled value={selectedUser.lastName} fullWidth label="Full Name" variant="standard" />
                                    </div>
                                    <div className="form-controller-input form-controller">
                                        <TextField disabled value={selectedUser.email} fullWidth label="Email" variant="standard" />
                                    </div>
                                </section>

                                <section>
                                    <div className="user-profile-section-title">Company Details</div>

                                    <div className="form-controller-input form-controller">
                                        <TextField disabled value={selectedUser.companyName} fullWidth label="Company Name" variant="standard" />
                                    </div>

                                </section>
                            </Box>
                        </div>
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
                const { data, errors } = await adminService.getBuyers(abortController.signal);
                if (errors.length === 0) {
                    const filteredData = data.data.data;
                    filteredData.map((user, index) => {
                        user.index = index + 1;
                        user.fullName = `${user.firstName} ${user.lastName}`;
                        user.joinedSince = user.createdOn;
                        user.status = user.isVerified;
                        user.activated = user.enabled;
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
        <div className="UsersBuyer-Table">
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

export default UsersBuyer;