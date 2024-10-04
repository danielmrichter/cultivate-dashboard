import {
  Box,
  CircularProgress,
  Link,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import ScatterPlot from "../GraphComponents/ScatterPlot";
import BarGraph from "../GraphComponents/BarGraph";
import { DataGrid } from "@mui/x-data-grid";
import ArrowBack from "@mui/icons-material/ArrowBack";

export default function PilerView() {
  const dispatch = useDispatch();
  const { pilerId } = useParams();
  const history = useHistory();
  const pilerData = useSelector((store) => store.piler);
  useEffect(() => {
    dispatch({ type: "FETCH_PILER_DATA", payload: pilerId });
  }, [pilerId]);

  const [chartFormatToDisplay, setChartFormatToDisplay] = useState("day");
  // We have to define the columns that the MUI Data Grid will use.
  const columnsDef = [
    {
      field: "ticket_number",
      headerName: "Ticket Number",
    },
    {
      field: "truck",
      headerName: "Truck",
    },
    {
      field: "field",
      headerName: "Grower",
    },
    {
      field: "temperature",
      headerName: "Temperature",
    },
    {
      field: "coordinates",
      headerName: "Coordinates",
    },
    {
      field: "temperature_time",
      headerName: "Temperature Time",
      width: "150px",
    },
    {
      field: "updated_at",
      headerName: "Last Updated",
      width: "150px",
    },
  ];
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
    }
    if (chartFormatToDisplay === "month") {
      return (
        <>
          <Typography variant="h4">Averages Over The Day</Typography>
          <BarGraph
            data={pilerData.barChartMonthData}
            x="day"
            y="temperature"
            xLabel="Day"
            yLabel="temperature"
          />
        </>
      );
    }
    return <div>Error</div>;
  };
  // First, we have to check if we have data to render
  return pilerData.ticketData ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          alignContent: "center",
          gap: 5,
        }}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "50vh",
            pb: 5,
          }}
        >
          <Typography variant="h4">Heat Map Of Pile</Typography>
          <ScatterPlot
            data={pilerData.heatMapData}
            x="x"
            y="temperature"
            xLabel="Latitude"
            yLabel="Temperature"
          />
        </Paper>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "50vh",
            pb: 5,
          }}
        >
          {chartFormatRender()}
          <ToggleButtonGroup
            size="small"
            sx={{
              width: "100%",
            }}
            color="primary"
            value={chartFormatToDisplay}
            exclusive
            onChange={(e, n) => setChartFormatToDisplay(n)}
            aria-label="Platform"
          >
            <ToggleButton
              sx={{ flexGrow: 1, borderRadius: "25px" }}
              value="day"
            >
              Day
            </ToggleButton>
            <ToggleButton
              sx={{ flexGrow: 1, borderRadius: "25px" }}
              value="month"
            >
              Month
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Box>
      <DataGrid
        autosizeOnMount
        columns={columnsDef}
        rows={pilerData.ticketData}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection={false}
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  ) : (
    // If we don't have data to render, let's just show a loading icon.
    <Box
      sx={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress color="primary.main" />
    </Box>
  );
}
