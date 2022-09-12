import "../Styles/Nav.css";
import logo from "../Assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";

const Nav = () => {
    const navigate = useNavigate();

    const defaultNavStyle = {
        textDecoration: "none",
        color: "inherit"
    }

    const handleRedirect = () => {
        navigate("/");
    }

    return (
        <div className="Nav Default-Nav">
            <div className="logo-container">
                <img style={{ cursor: "pointer" }} onClick={handleRedirect} src={logo} alt="tae logo" />
            </div>
            <ul className="nav-links-container">
                <li className="nav-links"><NavLink style={defaultNavStyle} to="/merchant/register">Become a Merchant</NavLink></li>
                <li className="nav-links"><NavLink style={defaultNavStyle} to="/buyer/register">Sign Up</NavLink></li>
                <li className="nav-links"><NavLink style={defaultNavStyle} to="/login">Login</NavLink></li>
            </ul>
        </div>
    )
}

export default Nav;