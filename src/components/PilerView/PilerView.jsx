import {
  Box,
  CircularProgress,
  Link,
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
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import ScatterPlot from "../GraphComponents/ScatterPlot";
import BarGraph from "../GraphComponents/BarGraph";
import { DataGrid } from "@mui/x-data-grid";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material";

export default function PilerView() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pilerId } = useParams();
  const history = useHistory();
  const pilerData = useSelector((store) => store.piler);
  const [chartFormatToDisplay, setChartFormatToDisplay] = useState("day");
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    dispatch({ type: "FETCH_PILER_DATA", payload: pilerId });
  }, [pilerId, dispatch]);

  // Ensure all rows have unique IDs
  const ticketData = pilerData.ticketData?.map((row, index) => ({
    ...row,
    beet_data_id: row.beet_data_id || `temp_id_${index}`,
  })) || [];

  const columnsDef = [
    { field: "ticket_number", headerName: "Ticket #", editable: true, flex: 0.5 },
    { field: "temperature", headerName: "Temp", editable: true, flex: 0.5 },
    { field: "temperature_time", headerName: "Temperature Time", editable: true, flex: 1 },
    { field: "truck", headerName: "Truck", editable: true, flex: 0.5 },
    { field: "field", headerName: "Grower", editable: false, flex: 1 },
    { field: "coordinates", headerName: "Coordinates", editable: true, flex: 1 },
    { field: "updated_at", headerName: "Last Updated", flex: 1 },
    {
      field: "markResolved",
      headerName: "",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          sx={{
            backgroundColor: theme.palette.error.main,
            color: "white",
            "&:hover": { backgroundColor: theme.palette.primary.main },
          }}
          onClick={() => handleMarkResolved(params.row.ticket_number)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleRowEdit = (updatedRow, originalRow) => {
    const mergedRow = { ...originalRow, ...updatedRow };
    setPendingUpdate(mergedRow);
    setOpenDialog(true);
    return mergedRow; // Immediately return the updated row to let DataGrid process it
  };

  const handleConfirmUpdate = () => {
    if (pendingUpdate && pendingUpdate.beet_data_id) {
      dispatch({ type: 'UPDATE_PILER_TICKET', payload: pendingUpdate });
      setOpenDialog(false);
    } else {
      console.error('Missing beet_data_id in pending update:', pendingUpdate);
    }
  };

  const handleCancelUpdate = () => {
    setOpenDialog(false);
    setPendingUpdate(null);
  };

  const handleProcessRowUpdateError = (error) => {
    console.error('Error updating row:', error);
  };

  const chartFormatRender = () => {
    if (chartFormatToDisplay === "day") {
      return (
        <>
          <Typography variant="h4">Averages Over The Day</Typography>
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
          <Typography variant="h4">Averages Over The Month</Typography>
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
      }}
    >
      <Link
        sx={{ alignSelf: "flex-start", ml: 5, mt: 2 }}
        onClick={() => history.push(`/site/${pilerData.id}`)}
      >
        <ArrowBack />
        Back To Site Details
      </Link>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 5 }}>
        <Paper sx={{ height: "50vh", pb: 5 }}>
          <Typography variant="h4">Heat Map Of Pile</Typography>
          <ScatterPlot
            data={pilerData.heatMapData}
            x="x"
            y="y"
            xLabel="Latitude"
            yLabel="Temperature"
            temp="temperature"
          />
        </Paper>

        <Paper sx={{ height: "50vh", pb: 5 }}>
          {chartFormatRender()}
          <ToggleButtonGroup
            size="small"
            value={chartFormatToDisplay}
            exclusive
            onChange={(e, n) => setChartFormatToDisplay(n)}
            sx={{ width: "100%" }}
          >
            <ToggleButton value="day" sx={{ flexGrow: 1 }}>Day</ToggleButton>
            <ToggleButton value="month" sx={{ flexGrow: 1 }}>Month</ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Box>

      <Paper sx={{ padding: 4, width: "90%" }}>
        <Typography variant="h4">Ticket Data</Typography>
        <DataGrid
          columns={columnsDef}
          rows={ticketData}
          getRowId={(row) => row.beet_data_id}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          autoHeight
          processRowUpdate={handleRowEdit}
          onProcessRowUpdateError={handleProcessRowUpdateError}
        />
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelUpdate}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update ticket {pendingUpdate?.ticket_number}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate} color="primary">No</Button>
          <Button onClick={handleConfirmUpdate} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  ) : (
    <Box sx={{ display: "flex", justifyContent: "center", height: "100vh" }}>
      <CircularProgress color="primary.main" />
    </Box>
  );
}
