import {
  Box,
  CircularProgress,
  Paper,
  ToggleButton,
  Button,
  ToggleButtonGroup,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useNavigate, useParams } from "react-router-dom";
import BarGraph from "../GraphComponents/BarGraph";
import { DataGrid } from "@mui/x-data-grid";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material";
import useInterval from "../../hooks/useInterval";
import axios from "axios";
import DummyData from "../DummyData.json"
import ScatterPlot from "../GraphComponents/ScatterPlot";

export default function PilerView() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { pilerId } = useParams();
  const navigate = useNavigate();
  const pilerData = useAppSelector((store) => store.piler);
  const [chartFormatToDisplay, setChartFormatToDisplay] = useState("day");
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    dispatch({ type: "FETCH_PILER_DATA", payload: pilerId });
  }, [pilerId, dispatch]);
  useInterval(() => dispatch({ type: "FETCH_PILER_DATA", payload: pilerId }));
  const ticketData =
    pilerData.ticketData?.map((row, index) => ({
      ...row,
      beet_data_id: row.beet_data_id || `temp_id_${index}`,
    })) || [];

  const columnsDef = [
    {
      field: "ticket_number",
      headerName: "Ticket #",
      editable: true,
      flex: 0.5,
    },
    { field: "temperature", headerName: "Temp", editable: true, flex: 0.5 },
    {
      field: "temperature_time",
      headerName: "Temperature Time",
      editable: true,
      flex: 1,
    },
    { field: "truck", headerName: "Truck", editable: true, flex: 0.5 },
    { field: "field", headerName: "Grower", editable: false, flex: 1 },
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
                      height: '100%',
                  }}
              >
                  <Typography fontSize={12}>
                      {Number.parseFloat(coordinates.x).toFixed(3)}, {Number.parseFloat(coordinates.y).toFixed(3)}
                  </Typography>
              </Box>);
          }
          return 'N/A';
      },
  },
    { field: "updated_at", headerName: "Last Updated", flex: 1 },
    {
      field: "markResolved",
      headerName: "",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          sx={{
            backgroundColor: "error.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.main" },
          }}
          onClick={() => {
            handleDeleteTicket(params.row.beet_data_id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleBackClick = () => {
    navigate(`/site/${pilerData.siteInfo.id}`);
  };

  const handleRowEdit = (updatedRow, originalRow) => {
    const mergedRow = { ...originalRow, ...updatedRow };
    setPendingUpdate(mergedRow);
    setOpenDialog(true);
    return mergedRow;
  };

  const handleConfirmUpdate = () => {
    if (pendingUpdate && pendingUpdate.beet_data_id) {
      dispatch({ type: "UPDATE_PILER_TICKET", payload: pendingUpdate });
      setOpenDialog(false);
    } else {
      console.error("Missing beet_data_id in pending update:", pendingUpdate);
    }
  };

  const handleCancelUpdate = () => {
    setOpenDialog(false);
    setPendingUpdate(null);
  };


  
  const handleDeleteTicket = (beet_data_id) => {
    if (!beet_data_id) {
      console.error("Missing ticketId for delete operation.");
      return;
    }
    dispatch({ type: "DELETE_PILER_TICKET", payload: { beet_data_id } });
  };

  const handleAddTicket = (piler, siteId) => {
    navigate(`/add-ticket/${siteId}/${piler}`);
  };

  const handleProcessRowUpdateError = (error) => {
    console.error("Error updating row:", error);
  };

  const chartTitleRender = () => {
    if (chartFormatToDisplay === "day") {
      return (
        <Typography variant="h4" sx={{ alignSelf: "start" }}>
          <b>Averages Over The Day</b>
        </Typography>
      );
    } else if (chartFormatToDisplay === "month") {
      return (
        <Typography variant="h4" sx={{ alignSelf: "start" }}>
          <b>Averages Over The Month</b>
        </Typography>
      );
    }
    return <div>Error</div>;
  };

  const chartFormatRender = () => {
    if (chartFormatToDisplay === "day") {
      return (
        <>
          <BarGraph
            data={pilerData.barChartDayData}
            x="hour"
            y="temperature"
            xLabel="Time"
            yLabel="Temperature"
          />
        </>
      );
    } else if (chartFormatToDisplay === "month") {
      return (
        <>
          <BarGraph
            data={pilerData.barChartMonthData}
            x="day"
            y="temperature"
            xLabel="Day"
            yLabel="Temperature"
          />
        </>
      );
    }
    return <div>Error</div>;
  };

  return pilerData.ticketData ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        marginX: 0,
        width: "100vw",
        paddingBottom: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          paddingTop: 4,
          paddingLeft: 4,
        }}
      >
        <Typography variant="h3">
          <b onClick={() => {axios.post('/api/beet_data', DummyData)}}>{pilerData.siteInfo.piler_name} Details:</b>
        </Typography>
        <Button
          sx={{ mb: 4, alignSelf: "flex-start" }}
          onClick={handleBackClick}
        >
          <ArrowBack />
          Back to Dashboard
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 5,
          width: "100%",
        }}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "550px",
            width: "44%",
            padding: "16px",
            gap: "16px",
          }}
        >
          <Typography variant="h4" sx={{ alignSelf: "start" }}>
            <b>Heat Map Of Pile</b>
          </Typography>
          <ScatterPlot
            data={pilerData.heatMapData}
            x="x"
            y="y"
            xLabel="Longitude"
            yLabel="Latitude"
            temp="temperature"
          />
        </Paper>

        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "550px",
            width: "44%",
            padding: "16px",
            gap: "16px",
          }}
        >
          {chartTitleRender()}
          <ToggleButtonGroup
            size="small"
            value={chartFormatToDisplay}
            exclusive
            onChange={(e, n) => setChartFormatToDisplay(n)}
            sx={{ width: "100%" }}
          >
            <ToggleButton value="day" sx={{ flexGrow: 1 }}>
              Day
            </ToggleButton>
            <ToggleButton value="month" sx={{ flexGrow: 1 }}>
              Month
            </ToggleButton>
          </ToggleButtonGroup>
          {chartFormatRender()}
        </Paper>
      </Box>

      <Paper sx={{ padding: 4, width: "90%" }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 5, mb: 4 }}>
          <Typography variant="h4">
            <b>Ticket Data</b>
          </Typography>{" "}
          <Button
            variant="contained"
            sx={{ borderRadius: 15 }}
            onClick={() => handleAddTicket(pilerData.siteInfo.id, pilerId)}
          >
            Add Ticket
          </Button>
        </Box>
        <DataGrid
          columns={columnsDef}
          rows={ticketData}
          getRowId={(row) => row.beet_data_id}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          autoHeight
          processRowUpdate={handleRowEdit}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          initialState={{
            sorting: {
              sortModel: [{ field: 'temperature_time', sort: 'desc' }],
            },
          }}
          sx={{
            "& .MuiDataGrid-row": {
              "&.alert-row": {
                backgroundColor: theme.palette.error.light,
              },
              "&.warning-row": {
                backgroundColor: theme.palette.warning.light,
              },
              "&.normal-row": {
                backgroundColor: "#FFFFFF",
              },
            },
          }}
          getRowClassName={(params) => {
            const temp = params.row.temperature;
            if (temp >= 43) return "alert-row";
            if (temp >= 40 && temp ) return "warning-row";
            return "normal-row";
          }}
        />
      </Paper>

      <Dialog open={openDialog}>
        <DialogTitle>{"Update Data?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to update the ticket?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  ) : (
    <CircularProgress />
  );
}
