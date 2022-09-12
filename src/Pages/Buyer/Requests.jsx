import OrdersTable from "../../Components/Buyer/Tables/Orders";
import "../../Styles/Tables.css";

const Requests = () => {
    return (
        <div className="Requests-Page">
            <div className="tables-container">
                <div className="dash-items-title-container">
                    <div>Requests</div>
                    <div>Timeline of all eligible requests from buyer</div>
                </div>
                <div>
                    <OrdersTable />
                </div>
            </div>
        </div>
    )
};

export default Requests;