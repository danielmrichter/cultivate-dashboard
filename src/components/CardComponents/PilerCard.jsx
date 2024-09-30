import { Button, ToggleButtonGroup, Paper, ToggleButton } from "@mui/material";
import ScatterPlot from "../GraphComponents/ScatterPlot";
import { useState } from "react";

export default function PilerCard(props) {
  const [chartFormat, setChartFormat] = useState("day");
  const data = props.data;
  console.log(data)

  const handleChange = (event, newAlignment) => {
    setChartFormat(newAlignment);
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "300px",
        padding: "16px",
        gap: "16px"
      }}
    >
      <h2>{data.piler_name}</h2>

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

      {/* <ScatterPlot
        data={data}
        x={props.x}
        y={props.y}
        xLabel={props.xLabel}
        yLabel={props.yLabel}
      /> */}

      <Button variant="contained" sx={{ borderRadius: "30px" }}>
        Piler Details
      </Button>
    </Paper>
  );
}

