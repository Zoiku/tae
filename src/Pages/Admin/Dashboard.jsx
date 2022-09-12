import "../../Styles/DashboardAdmin.css";

import SalesChart from "../../Components/Admin/Charts/Sales";
import CategoriesChart from "../../Components/Admin/Charts/Categories";

import OrdersTable from "../../Components/Admin/Tables/Orders";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";

import Salutation from "../../Components/Salutation";

const AdminDashboard = () => {
    const data = {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        values: [42, 31, 31, 53, 31, 41, 32, 51, 24, 55, 76, 12]
    }

    return (
        <div className="Admin-DashBoard">
            <div>
                <Salutation name={'Admin'} />
            </div>

            <div className="dashboard-body-container">
                <div>
                    <div className="dash-items-title-container">
                        <div>Merchant to Buyer Ratio</div>
                        <div>A positive merchant to buyers ratio should be at least 0.5</div>
                    </div>
                    <div className="dash-item-value-container">
                        <div>1.0</div>
                    </div>
                </div>
                <Swiper
                    direction={"vertical"}
                    autoplay={{
                        delay: 2500,
                    }}
                    loop={true}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination, Autoplay]}
                >
                    <SwiperSlide>
                        <div className="dash-items-title-container">
                            <div>Unactivated Users</div>
                            <div>Check the users tab to activate registered accounts</div>
                        </div>
                        <div className="dash-item-value-container">
                            <div>40</div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="dash-items-title-container">
                            <div>Pending Orders</div>
                            <div>Check the orders tab to approve orders</div>
                        </div>
                        <div className="dash-item-value-container">
                            <div>20</div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="dash-items-title-container">
                            <div>Delivered Orders</div>
                            <div>Orders that have been delivered to buyers</div>
                        </div>
                        <div className="dash-item-value-container">
                            <div>20</div>
                        </div>
                    </SwiperSlide>
                </Swiper>

                <div>
                    <div className="dash-items-title-container" style={{ marginBottom: 20 }}>
                        <div>Requests per Categories</div>
                        <div>Requests per product categories</div>
                    </div>
                    <div className="dash-item-category-chart-container">
                        <CategoriesChart />
                    </div>
                </div>

                <div>
                    <div className="dash-items-title-container">
                        <div>This Year: Sales Activity</div>
                        <div>Total Requests from sales per month</div>
                    </div>
                    <div>
                        <SalesChart labels={data.labels} values={data.values} />
                    </div>
                </div>
                <div>
                    <div className="dash-items-title-container">
                        <div>Upcoming Products</div>
                        <div>Products coming soon</div>
                    </div>
                    <div>
                        <div style={{ fontSize: "small", color: "gray" }}>No products</div>
                    </div>
                </div>
                <div>
                    <div className="dash-items-title-container">
                        <div>Recent Orders</div>
                        <div>Orders made in the past 24 hours</div>
                    </div>
                    <div>
                        <OrdersTable />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AdminDashboard;