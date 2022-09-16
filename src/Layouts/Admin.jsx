import "../Styles/AppLayout.css";
import { Outlet } from "react-router-dom";
import Nav from "../Components/Admin/Nav";
import Menu from "../Components/Admin/Menu";
import AppNav from "../Components/Admin/AppNav";
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import Drawer from '@mui/material/Drawer';
// import CloseIcon from '@mui/icons-material/Close';
// import { PrimaryButton } from "../Material/Button";
// import { useState } from "react"

const AdminLayout = () => {
    // const [openDrawer, setOpenDrawer] = useState(true);
    // const toggleDrawer = (open) => (_event) => {
    //     setOpenDrawer(open);
    // };

    // const list = () => (
    //     <Box
    //         sx={{ width: "auto", minHeight: "500px" }}
    //         role="presentation"
    //         className="drawer-container"
    //     >
    //         <div className="drawer-title-container">
    //             <div>Complete Company Profile</div>
    //             <div><CloseIcon className="close-icon" onClick={toggleDrawer(false)} /></div>
    //         </div>
    //         <div className="drawer-body">
    //             <div className="drawer-desc">
    //                 <div>Almost Done!</div>
    //                 <div>Please provide the following company details to complete setting up your merchant account.</div>
    //             </div>
    //             <div className="drawer-form-controller-container">
    //                 <div className="form-controller-duo-input">
    //                     <TextField fullWidth label="Year Established" variant="standard" />
    //                     <TextField fullWidth label="Number of Employees" variant="standard" />
    //                 </div>

    //                 <div className="form-controller-input">
    //                     <TextField InputProps={{ endAdornment: <div style={{ width: "300px", textAlign: "right", fontSize: "12px", color: "gray" }}>20ft per month</div> }} fullWidth label="Supply Ability" variant="standard" />
    //                 </div>

    //                 <div className="form-controller-input">
    //                     <TextField multiline rows={5} fullWidth label="Company History" variant="standard" />
    //                 </div>
    //             </div>
    //             <div><PrimaryButton variant="contained" sx={{ width: "100%" }}>Complete Profile</PrimaryButton></div>
    //         </div>
    //     </Box>
    // );

    return (
        <div className="Admin-Layout App-Layout">
            {/* <div>
                <Drawer
                    className="drawer"
                    variant="temporary"
                    anchor="bottom"
                    open={openDrawer}
                >
                    {list()}
                </Drawer>
            </div> */}

            <Nav />
            <div className="app-container">
                <div className="app-menu-container">
                    <Menu />
                </div>
                <div className="app-body-container">
                    <div className="app-body">
                        <Outlet />
                    </div>
                </div>
                <div className="app-bottom-navigation">
                    <AppNav />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;