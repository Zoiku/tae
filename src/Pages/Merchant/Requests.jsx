import RequestsTable from "../../Components/Merchant/Tables/Requests";
import "../../Styles/Tables.css";

const Requests = () => {
    return (
        <div className="Quotations-Page">
            <div className="tables-container">
                <div className="dash-items-title-container">
                    <div>Requests Timeline</div>
                    <div>Timeline of all eligible requests</div>
                </div>
                <div>
                    <RequestsTable />
                </div>
            </div>
        </div>
    )
}

export default Requests;