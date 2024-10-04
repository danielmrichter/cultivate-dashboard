import { Button, Paper, Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export default function AlertHistory() {
    const dispatch = useDispatch();
    const theme = useTheme();
    
    useEffect(() => {
        dispatch({ type: 'FETCH_ALL_ALERTS' });
    }, [dispatch]);

    const redAlerts = useSelector(store => store.alerts.allSiteAlerts.redAlerts);
    const warningAlerts = useSelector(store => store.alerts.allSiteAlerts.warningAlerts);

    const handleMarkResolved = (id) => {
        dispatch({ type: 'MARK_RESOLVED', payload: id });
    };

    const columns = [
        { field: 'ticket_number', headerName: 'Ticket #', flex: 0.5 },
        { field: 'temperature', headerName: 'Temp', flex: 0.5 },
        { field: 'temperature_time', headerName: 'Temperature Time', flex: 1 },
        { field: 'piler_name', headerName: 'Piler', flex: 1 },
        { field: 'truck', headerName: 'Truck', flex: 1 },
        { field: 'grower_name', headerName: 'Grower', flex: 1 },
        { field: 'coordinates', headerName: 'Coordinates', flex: 2 },
        { field: 'updated_at', headerName: 'Updated At', flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (params.row.is_active ? 'Unresolved' : 'Resolved'),
        },
        {
            field: 'markResolved',
            headerName: '',
            flex: 1.5,
            renderCell: (params) => (
                <Button
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                            backgroundColor: theme.palette.primary.main, // No hover change
                        },
                        '&:active': {
                            backgroundColor: theme.palette.primary.main, // No active change
                        },
                    }}
                    onClick={() => handleMarkResolved(params.row.alert_id)}
                >
                    {params.row.is_active ? "Mark Resolved" : "Mark Unresolved"}
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ padding: '24px' }}>
            <h2><b><u>Alert History:</u></b></h2>
            <Button><ArrowBack />Return to Dashboard</Button>
            <Paper sx={{ padding: '24px' }}>
                <h3>Red Alerts:</h3>
                <div style={{ height: '100%', width: '100%' }}>
                    <DataGrid
                        rows={redAlerts}
                        columns={columns}
                        getRowId={(row) => row.ticket_number}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection={false}
                        disableRowSelectionOnClick
                        autoHeight
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'temperature_time', sort: 'desc' }],
                            },
                        }}
                        sx={{
                            width: '100%',
                            '& .red-alert-row': {
                                backgroundColor: theme.palette.error.light,
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: theme.palette.error.light, // Retain color, no hover effect
                            },
                        }}
                        getRowClassName={(params) =>
                            'red-alert-row' // Always apply this class regardless of is_active status
                        }
                    />
                </div>
                <h3>Warning Alerts:</h3>
                <div style={{ height: '100%', width: '100%' }}>
                    <DataGrid
                        rows={warningAlerts}
                        columns={columns}
                        getRowId={(row) => row.ticket_number}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection={false}
                        disableRowSelectionOnClick
                        autoHeight
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'temperature_time', sort: 'desc' }],
                            },
                        }}
                        sx={{
                            width: '100%',
                            '& .warning-alert-row': {
                                backgroundColor: theme.palette.warning.light,
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: theme.palette.warning.light, // Retain color, no hover effect
                            },
                        }}
                        getRowClassName={(params) =>
                            'warning-alert-row' // Always apply this class regardless of is_active status
                        }
                    />
                </div>
            </Paper>
        </Box>
    );
}


