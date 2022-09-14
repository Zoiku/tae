import "../Styles/Nav.css";
import logo from "../Assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

const Nav = () => {
    const [state, setState] = useState(false);
    const navigate = useNavigate();
    const defaultNavStyle = {
        textDecoration: "none",
        color: "inherit"
    }
    const handleRedirect = () => {
        navigate("/");
    }
    const toggleDrawer = (open) => (_event) => {
        setState(open);
    };

    const list = () => (
        <Box
            sx={{
                overflow: "clip",
                width: "100%",
                background: "#ee9b00",
                height: "100vh",
                position: "relative",
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
        >
            <div>
                <div className="menu-icons-close">
                    <span
                        onClick={toggleDrawer(false)}
                        className="material-symbols-rounded menu-icons"
                    >
                        close
                    </span>
                </div>
            </div>

            <div className="menu-links-container-moblile">
                <div className="menu-links-mobile" onClick={() => navigate('/')}>
                    <span className="material-symbols-rounded">
                        home
                    </span>
                    <span>Home</span>
                </div>
                <div className="menu-links-mobile" onClick={() => navigate('/login')}>
                    <span className="material-symbols-rounded">
                        login
                    </span>
                    <span>Login</span>
                </div>
                <div className="menu-links-mobile" onClick={() => navigate('/buyer/register')}>
                    <span className="material-symbols-rounded">
                        account_circle
                    </span>
                    <span>Create an Account</span>
                </div>
                <div className="menu-links-mobile" onClick={() => navigate('/merchant/register')}>
                    <span className="material-symbols-rounded">
                        admin_panel_settings
                    </span>
                    <span>Become a Merchant</span>
                </div>
            </div>
            <div style={{ position: "fixed", bottom: -30, fontWeight: 700, left: -15, fontSize: 100, opacity: .2, color: "black" }}>menu</div>
        </Box>
    );

    return (
        <div className="Nav">
            <div className="Mobile-Nav">
                <div>
                    <div className="Nav-logo-tae-container">
                        <div>
                            <img src={logo} alt="" />
                        </div>
                    </div>

                    <Drawer
                        className="drawer"
                        anchor={"top"}
                        open={state}
                    >
                        {list()}
                    </Drawer>
                </div>

                <Button onClick={toggleDrawer(true)}>
                    {!state &&
                        <div>
                            <span
                                onClick={toggleDrawer(true)}
                                className="material-symbols-rounded menu-icons menu-hamburger"
                            >
                                menu
                            </span>
                        </div>
                    }
                </Button>
            </div>

            <div className="Default">
                <div className="logo-container">
                    <img style={{ cursor: "pointer" }} onClick={handleRedirect} src={logo} alt="tae logo" />
                </div>
                <ul className="nav-links-container">
                    <li className="nav-links"><NavLink style={defaultNavStyle} to="/merchant/register">Become a Merchant</NavLink></li>
                    <li className="nav-links"><NavLink style={defaultNavStyle} to="/buyer/register">Sign Up</NavLink></li>
                    <li className="nav-links"><NavLink style={defaultNavStyle} to="/login">Login</NavLink></li>
                </ul>
            </div>
        </div>
    )
}

export default Nav;