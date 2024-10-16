import { Button, ToggleButtonGroup, Paper, ToggleButton, Box, Typography } from "@mui/material";
import ScatterPlot from "../GraphComponents/ScatterPlot";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PilerCard(props) {
  const navigate = useNavigate();
  const [chartFormat, setChartFormat] = useState("day");
  const pilerData = props.data;
  const dayData = pilerData.dayActuals;
  const monthAvgDaily = pilerData.monthAvgDaily;

  const handleChange = (event, newAlignment) => {
    setChartFormat(newAlignment);
  };

  const handlePilerDetails = () => {
    navigate(`/piler-details/${pilerData.piler_id}`);
  };

  const scatterChartDisplay = () => {
    if (chartFormat === "day") {
      if (dayData && dayData.length > 0) {
        return (
          <ScatterPlot
            data={dayData}
            x="time"
            y="temperature"
            xLabel="Time"
            yLabel="Temperature"
            temp="temperature"
          />
        );
      } else {
        return <Typography sx={{textAlign: 'center'}}>No data available for the selected format.</Typography>;
      }
    } else if (chartFormat === "month") {
      if (monthAvgDaily && monthAvgDaily.length > 0) {
        return (
          <ScatterPlot
            data={monthAvgDaily}
            x="day"
            y="avgTempOfEachDay"
            xLabel="Day"
            yLabel="Avg Daily Temp"
            temp="avgTempOfEachDay"
          />
        );
      } else {
        return <Typography sx={{textAlign: 'center'}}>No data available for the selected format.</Typography>;
      }
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "400px",
        padding: "16px",
        gap: "16px"
      }}
    >
      <h2>{pilerData.piler_name}</h2>

      <ToggleButtonGroup
        size="small"
        sx={{ width: "100%" }}
        color="primary"
        value={chartFormat}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton sx={{ flexGrow: 1, borderRadius: "25px" }} value="day">
          Day
        </ToggleButton>
        <ToggleButton sx={{ flexGrow: 1, borderRadius: "25px" }} value="month">
          Month
        </ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ width: '100%', height: '350px' }}>
        {scatterChartDisplay()}
      </Box>
      <Button variant="contained" sx={{ borderRadius: "30px" }}
        onClick={handlePilerDetails}>
        Piler Details
      </Button>
    </Paper>
  );
}


