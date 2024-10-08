import { Button, Paper, Box, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useHistory, useParams } from "react-router-dom";

export default function AlertHistory() {
    const dispatch = useDispatch();
    const history = useHistory();
    const theme = useTheme();
    
    useEffect(() => {
        dispatch({ type: 'FETCH_ALL_ALERTS' });
    }, [dispatch]);

    const redAlerts = useSelector(store => store.alerts.allSiteAlerts.redAlerts);
    const warningAlerts = useSelector(store => store.alerts.allSiteAlerts.warningAlerts);
    const { id } = useParams();

    const handleMarkResolved = (id) => {
        dispatch({ type: 'MARK_RESOLVED', payload: id });
    };

    const columns = [
        { field: 'ticket_number', headerName: 'Ticket #', flex: .75 },
        { field: 'temperature', headerName: 'Temp', flex: .75},
        { field: 'temperature_time', headerName: 'Time', flex: 1 },
        { field: 'piler_name', headerName: 'Piler', flex: .75 },
        { field: 'truck', headerName: 'Truck', flex: .75 },
        {
            field: 'coordinates',
            headerName: 'Coordinates',
            flex: 1,
            renderCell: (params) => {
                const { coordinates } = params.row;
                if (coordinates && coordinates.x !== undefined && coordinates.y !== undefined) {
                    return (
                        <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            textAlign: 'center',
                        }}
                    >
                        <Typography fontSize={12}>
                            {Number.parseFloat(coordinates.x).toFixed(2)}, {Number.parseFloat(coordinates.y).toFixed(2)}
                        </Typography>
                    </Box>);
                }
                return 'N/A';
            },
        },
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
            flex: 1.25,
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
const handleBackClick = () => {
    console.log('Site Id is:', id)
    history.push(`/site/${id}`)
}

    return (
        <Box sx={{ padding: '24px' }}>
            <Typography variant="h3"><b>Alert History:</b></Typography>
            <Button sx={{mb: 4}} onClick={handleBackClick}><ArrowBack />Back to Dashboard</Button>
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
                            fontSize: '10pt',
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