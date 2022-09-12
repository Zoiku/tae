import { DataGrid } from "@mui/x-data-grid";

import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from "../../../Material/Toolbar";

const Orders = () => {
    const columns = [
        { field: "id", headerName: "Request #", width: 100 },
        { field: "product", headerName: "Product", width: 200 },
        { field: "terms", headerName: "Terms", width: 70 },
        { field: "destination", headerName: "Destination", width: 100 },
        { field: "quantity", headerName: "Quantity", width: 90 },
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
    ]

    return (
        <div className="Orders-Table">
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

export default Orders;