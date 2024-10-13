import { Button, Paper, Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

export default function AlertHistory() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const redAlerts = useAppSelector(
    (store) => store.alerts.allSiteAlerts.redAlerts
  );
  const warningAlerts = useAppSelector(
    (store) => store.alerts.allSiteAlerts.warningAlerts
  );
  const { siteId } = useParams();
  const errorResolved = "#ffe3d9";
  const warningResolved = "#ffffd4";

  useEffect(() => {
    dispatch({ type: "FETCH_ALL_ALERTS", payload: siteId });
  }, [dispatch]);

  const handleMarkResolved = (id) => {
    dispatch({
      type: "MARK_RESOLVED",
      payload: { alertId: id, siteId: siteId },
    });
  };

  const columns = [
    { field: "ticket_number", headerName: "Ticket #", flex: 0.75 },
    { field: "temperature", headerName: "Temp", flex: 0.75 },
    { field: "temperature_time", headerName: "Time", flex: 1 },
    { field: "piler_name", headerName: "Piler", flex: 0.75 },
    { field: "truck", headerName: "Truck", flex: 0.75 },
    {
      field: "coordinates",
      headerName: "Coordinates",
      flex: 1,
      renderCell: (params) => {
        const { coordinates } = params.row;
        if (
          coordinates &&
          coordinates.x !== undefined &&
          coordinates.y !== undefined
        ) {
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                textAlign: "center",
              }}
            >
              <Typography fontSize={12}>
                {Number.parseFloat(coordinates.x).toFixed(2)},{" "}
                {Number.parseFloat(coordinates.y).toFixed(2)}
              </Typography>
            </Box>
          );
        }
        return "N/A";
      },
    },
    { field: "updated_at", headerName: "Updated At", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) =>
        params.row.is_active ? "Unresolved" : "Resolved",
    },
    {
      field: "markResolved",
      headerName: "",
      flex: 1.25,
      renderCell: (params) => (
        <Button
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&:hover": {
              backgroundColor: theme.palette.primary.main, // No hover change
            },
            "&:active": {
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
    navigate(`/site/${siteId}`);
  };

  return (
    <Box sx={{ padding: "24px" }}>
      <Typography variant="h3">
        <b>Alert History:</b>
      </Typography>
      <Button sx={{ mb: 4 }} onClick={handleBackClick}>
        <ArrowBack />
        Back to Dashboard
      </Button>
      <Paper sx={{ padding: "24px" }}>
        <h3>Red Alerts:</h3>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={redAlerts}
            columns={columns}
            getRowId={(row) => row.ticket_number}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection={false}
            disableRowSelectionOnClick
            autoHeight
            initialState={{
              sorting: {
                sortModel: [{ field: "temperature_time", sort: "desc" }],
              },
            }}
            sx={{
              width: "100%",
              "& .red-alert-row": {
                backgroundColor: theme.palette.error.light,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.error.light,
              },
              "& .error-alert-row-resolved": {
                backgroundColor: errorResolved,
              },
              fontSize: "10pt",
            }}
            getRowClassName={
              (params) => {
                if (params.row.is_active){
                    return "red-alert-row"
                } else {
                    return 'error-alert-row-resolved'
                }
            }}
          />
        </div>
        <h3>Warning Alerts:</h3>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={warningAlerts}
            columns={columns}
            getRowId={(row) => row.ticket_number}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection={false}
            disableRowSelectionOnClick
            autoHeight
            initialState={{
              sorting: {
                sortModel: [{ field: "temperature_time", sort: "desc" }],
              },
            }}
            sx={{
              width: "100%",
              "& .warning-alert-row": {
                backgroundColor: theme.palette.warning.light,
              },
              "& .warning-alert-row-resolved": {
                backgroundColor: warningResolved,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.warning.light,
              }
            }}
            getRowClassName={(params) => {
              if (params.row.is_active) {
                return "warning-alert-row";
              } else {
                return "warning-alert-row-resolved";
              }
            }}
          />
        </div>
      </Paper>
    </Box>
  );
}
