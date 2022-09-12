import "../Styles/AppLayout.css";
import { Outlet } from "react-router-dom";
import Nav from "../Components/Merchant/Nav";
import Menu from "../Components/Merchant/Menu";
import AppNav from "../Components/Merchant/AppNav";

const MerchantLayout = () => {
    return (
        <div className="Merchant-Layout App-Layout">
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

export default MerchantLayout;