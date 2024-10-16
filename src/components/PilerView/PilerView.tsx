import {
  Box,
  CircularProgress,
  Paper,
  ToggleButton,
  Button,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useNavigate, useParams } from "react-router-dom";
import HeatScatter from "../GraphComponents/HeatScatter";
import BarGraph from "../GraphComponents/BarGraph";
import { DataGrid } from "@mui/x-data-grid";
import ArrowBack from "@mui/icons-material/ArrowBack";
import useInterval from "../../hooks/useInterval";
import { columnsDef } from "./_defs/_defs";
import UpdateTicket from "./UpdateTicket/UpdateTicket.jsx";

export default function PilerView() {
  const dispatch = useAppDispatch();
  const { pilerId } = useParams();
  const navigate = useNavigate();
  const pilerData = useAppSelector((store) => store.piler);
  const [chartFormatToDisplay, setChartFormatToDisplay] = useState("day");
 

  useEffect(() => {
    dispatch({ type: "FETCH_PILER_DATA", payload: pilerId });
  }, [pilerId, dispatch]);

  useInterval(() => dispatch({ type: "FETCH_PILER_DATA", payload: pilerId }));

  const ticketData =
    pilerData.ticketData?.map((row, index: number) => ({
      ...row,
      beet_data_id: row.beet_data_id || `temp_id_${index}`,
    })) || [];

  // All of this stuff is for editing. It controls a dialog
  // To confirm if a user wants to edit something.
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const handleRowEdit = (updatedRow, originalRow) => {
    const mergedRow = { ...originalRow, ...updatedRow };
    setPendingUpdate(mergedRow);
    setIsDialogOpen(true);
  };
  const handleConfirmUpdate = () => {
    if (pendingUpdate && pendingUpdate.beet_data_id) {
      dispatch({ type: "UPDATE_PILER_TICKET", payload: pendingUpdate });
      setIsDialogOpen(false);
    } else {
      console.error("Missing beet_data_id in pending update:", pendingUpdate);
    }
  };
  const handleCancelUpdate = () => {
    setIsDialogOpen(false);
    setPendingUpdate(null);
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

  return pilerData.ticketData[0] ? (
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
          <b>{pilerData.siteInfo.piler_name} Details:</b>
        </Typography>
        <Button
          sx={{ mb: 4, alignSelf: "flex-start" }}
          onClick={() => navigate(`/site/${pilerData.siteInfo.id}`)}
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
          <HeatScatter
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
            onClick={() => navigate(`/add-ticket/${pilerId}`)}
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
              sortModel: [{ field: "temperature_time", sort: "desc" }],
            },
          }}
          sx={{
            "& .MuiDataGrid-row": {
              "&.alert-row": {
                backgroundColor: "error.light",
              },
              "&.warning-row": {
                backgroundColor: "warning.light",
              },
              "&.normal-row": {
                backgroundColor: "#FFFFFF",
              },
            },
          }}
          getRowClassName={(params) => {
            const temp = params.row.temperature;
            if (temp >= 43) return "alert-row";
            if (temp >= 40 && temp) return "warning-row";
            return "normal-row";
          }}
        />
      </Paper>
      <UpdateTicket
        open={isDialogOpen}
        cancelFn={handleCancelUpdate}
        confirmFn={handleConfirmUpdate}
      />
    </Box>
  ) : (
    // 
    <CircularProgress />
  );
}
