import { Button, ToggleButtonGroup, Paper, ToggleButton } from "@mui/material";
import ScatterPlot from "../GraphComponents/ScatterPlot";
import { useState } from "react";
import { ResponsiveContainer } from "recharts";

export default function PilerCard(props) {
  const [chartFormat, setChartFormat] = useState("day");
  const pilerData = props.data;
  const dayData = pilerData.dayActuals;
  const monthAvgDaily = pilerData.monthAvgDaily;

  const handleChange = (event, newAlignment) => {
    setChartFormat(newAlignment);
  };

  const scatterChartDisplay = () => {
    if (chartFormat === "day") {
    return (
      <ScatterPlot
        data={dayData}
        x="time"
        y="temperature"
        xLabel="Time"
        yLabel="Temperature"
      />
    )
  } else if (chartFormat === "month") {
    return (
      <ScatterPlot 
      data={monthAvgDaily}
      x="day"
      y="avgTempOfEachDay"
      xLabel="Day"
      yLabel="Average Daily Temp"
      />
    )
  }
}
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "400px",
        height: "550px",
        padding: "16px",
        gap: "16px"
      }}
    >
      <h2>{pilerData.piler_name}</h2>

      <ToggleButtonGroup
        size="small"
        sx={{ 
          width: "100%"
        }}  
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
      {scatterChartDisplay()}
      <Button variant="contained" sx={{ borderRadius: "30px" }}>
        Piler Details
      </Button>
    </Paper>
  );
}

