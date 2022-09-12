import "../Styles/AppLayout.css";
import { Outlet } from "react-router-dom";
import Nav from "../Components/Buyer/Nav";
import Menu from "../Components/Buyer/Menu";
import AppNav from "../Components/Buyer/AppNav";

const BuyerLayout = () => {
    return (
        <div className="Buyer-Layout App-Layout">
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

export default BuyerLayout;