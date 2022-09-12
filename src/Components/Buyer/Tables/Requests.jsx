import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from "../../../Material/Toolbar";
import { SmallPrimary } from "../../../Material/Button";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState } from "react";
import Box from '@mui/material/Box';
import { Puller } from "../../../Material/Drawer";

const Requests = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = (open) => (_event) => {
        setOpenDrawer(open);
    };

    const columns = [
        { field: "id", headerName: "Request #", width: 100 },
        { field: "product", headerName: "Product", width: 200 },
        { field: "terms", headerName: "Terms", width: 70 },
        { field: "destination", headerName: "Destination", width: 100 },
        { field: "quantity", headerName: "Quantity", width: 90 },
        { field: "actions", headerName: "Actions", width: 90, renderCell: () => <SmallPrimary onClick={toggleDrawer(true)}>View</SmallPrimary> },

    ];

    const rows = [
        { id: 1, product: "Teak Round Log", terms: "CIF", destination: "India", quantity: 10 },
        { id: 2, product: "Teak Square", terms: "FOB", destination: "India", quantity: 30 },
        { id: 3, product: "Teak Square", terms: "FOB", destination: "India", quantity: 30 },
        { id: 4, product: "Teak Square", terms: "FOB", destination: "India", quantity: 30 },
        { id: 5, product: "Teak Square", terms: "FOB", destination: "India", quantity: 30 },
        { id: 6, product: "Teak Square", terms: "FOB", destination: "India", quantity: 30 },
        { id: 7, product: "Teak Square", terms: "FOB", destination: "India", quantity: 30 },
        { id: 8, product: "Teak Square", terms: "FOB", destination: "India", quantity: 30 },
        { id: 9, product: "Teak Square", terms: "FOB", destination: "India", quantity: 30 },
        { id: 10, product: "Teak Square", terms: "FOB", destination: "India", quantity: 30 },
    ];

    const list = () => (
        <Box
            sx={{ width: "auto", height: "700px" }}
            role="presentation"
            className="drawer-container"
        >
            <div className="drawer-title-container">
                <div>Request 1</div>
                <div className="requests-time-remaining">10hrs 00m</div>
                <Puller />
            </div>
            <div className="drawer-body">
                <div className="requests-sections-body">
                    <div className="requests-title-container">
                        <div>Date: 22 January, 2022</div>
                    </div>
                    <div className="requests-sections-container">
                        <section>
                            <div className="requests-section-title">Product Info</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Product:</span>
                                    <span>Teak Round Logs</span>
                                </div>
                                <div>
                                    <span>Species:</span>
                                    <span>Teak</span>
                                </div>
                                <div>
                                    <span>Types of species:</span>
                                    <span>Teak</span>
                                </div>
                                <div>
                                    <span>Origin:</span>
                                    <span>India</span>
                                </div>
                                <div>
                                    <span>Container size:</span>
                                    <span>1000 20ft</span>
                                </div>
                                <div>
                                    <span>Volume per container:</span>
                                    <span>13.5 Cubic meters</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Product Specification</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Length:</span>
                                    <span>20cm</span>
                                </div>
                                <div>
                                    <span>Thickness:</span>
                                    <span>2cm</span>
                                </div>
                                <div>
                                    <span>Diameter:</span>
                                    <span>20cm</span>
                                </div>
                                <div>
                                    <span>Quantity:</span>
                                    <span>20cm</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Product Delivery Information</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Incoterm:</span>
                                    <span>CIF</span>
                                </div>
                                <div>
                                    <span>Destination:</span>
                                    <span>India</span>
                                </div>
                                <div>
                                    <span>Destination Port:</span>
                                    <span>Nharva Sheva</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="requests-section-title">Request Settings</div>
                            <div className="request-section-body">
                                <div>
                                    <span>Validity:</span>
                                    <span>7 days</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Box>
    );

    return (
        <div className="Orders-Table">
            <div>
                <SwipeableDrawer
                    className="drawer"
                    variant="temporary"
                    anchor="bottom"
                    open={openDrawer}
                    onOpen={toggleDrawer(true)}
                    onClose={toggleDrawer(false)}
                >
                    {list()}
                </SwipeableDrawer>
            </div>

            <DataGrid
                components={{ Toolbar: Toolbar, LoadingOverlay: LinearProgress }}
                className="standard-table"
                checkboxSelection
                disableSelectionOnClick
                rows={rows}
                columns={columns}
                pagination
                density="compact"
                rowsPerPageOptions={[8, 16, 24, 32, 4]}
            />
        </div>
    )
}

export default Requests;