import { Button, Paper, Box, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export default function UserList() {
    const dispatch = useDispatch();
    const history = useHistory();
    const theme = useTheme();
    
    useEffect(() => {
        dispatch({ type: 'GET_SITE_LIST' });
    }, [dispatch]);

    useEffect(() => {
        dispatch({ type: 'FETCH_ALL_USERS' });
    }, [dispatch]);

    const userList = useSelector(store => store.userList);
    const siteList = useSelector(store => store.siteList);
    const [rows, setRows] = useState(userList.map((row) => ({...row, isClicked: false})));

    const handleMarkResolved = (id) => {
        dispatch({ type: 'MARK_RESOLVED', payload: id });
    };



    const toggleButton = (id) => {
        console.log('button was clicked')
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, isClicked: !row.isClicked } : row
        )
      );
  
    };

    const columns = [
        { field: 'username', headerName: 'Username', flex: 1},
        { field: 'fullname', headerName: 'Name', flex: 1 },
        { field: 'phone', headerName: 'Phone', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'sitename', headerName: 'Site', flex: 1 },
        {
            field: 'action',
            headerName: '',
            flex: 1,
            renderCell: (params) => {
              const isClicked = params.row.isClicked;
      
              return isClicked ? (
                // Render the second button if the first button was clicked
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => toggleButton(params.row.id)}
                >
                  Confirm
                </Button>
              ) : (
                // Render the default button initially
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => toggleButton(params.row.id)}
                >
                  Reassign Site
                </Button>
              );
            },
          },
        
        {
            field: 'delete',
            headerName: '',
            flex: 0.75,
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
                    Delete User
                </Button>
            ),
        },
    ];
const handleBackClick = () => {
    history.push(`/admin`)
}

    return (
        <Box sx={{ padding: '24px' }}>
            <Typography variant="h3"><b>User List:</b></Typography>
            <Button sx={{mb: 4}} onClick={handleBackClick}><ArrowBack />Return to Dashboard</Button>
            <Paper sx={{ padding: '24px' }}>
                <div style={{ height: '100%', width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.id}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection={false}
                        disableRowSelectionOnClick
                        autoHeight
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'sitename', sort: 'desc' }],
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
                        }

                        }
                    />
                </div>
            </Paper>
        </Box>
    );
}


