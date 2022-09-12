import { Outlet } from "react-router-dom";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";

const Default = () => {
    return (
        <div className="Default-Layout">
            <Nav />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Default;