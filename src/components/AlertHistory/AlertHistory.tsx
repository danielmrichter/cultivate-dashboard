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
  const { id } = useParams();
  const site = useAppSelector(store => store.site)  // to get site name if Site Manager
  const siteList = useAppSelector(store=> store.siteList) // to get site name if Gen Manager
  const siteName = Object.keys(site).length > 0 ? site.site_name : siteList[3]?.site;
  

  useEffect(() => {
    dispatch({ type: "FETCH_ALL_ALERTS", payload: id });
  }, [dispatch, id]);

  const handleMarkResolved = (alertId) => {
    dispatch({
      type: "MARK_RESOLVED",
      payload: { alertId: alertId, siteId: id },
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
      renderCell: (params) => {
        if (params.row.is_active) {
          return (
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
              Mark Resolved
            </Button>
          );
        } else {
          return (
            <Button
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.secondary.main, // No hover change
                },
                "&:active": {
                  backgroundColor: theme.palette.secondary.main, // No active change
                },
              }}
              onClick={() => handleMarkResolved(params.row.alert_id)}
            >
              Mark UnResolved
            </Button>
          );
        }
      },
    },
  ];
  const handleBackClick = () => {
    navigate(`/site/${id}`);
  };

  return (
    <Box sx={{ padding: "24px" }}>
      <Typography variant="h3">
        <b>Alert History: {siteName}</b>
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
                backgroundColor: theme.palette.error.light, // Retain color, no hover effect
              },
              fontSize: "10pt",
            }}
            getRowClassName={
              (params) => "red-alert-row" // Always apply this class regardless of is_active status
            }
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
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.warning.light, // Retain color, no hover effect
              },
            }}
            getRowClassName={
              (params) => "warning-alert-row" // Always apply this class regardless of is_active status
            }
          />
        </div>
      </Paper>
    </Box>
  );
}
