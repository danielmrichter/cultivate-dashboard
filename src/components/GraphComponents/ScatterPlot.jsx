import { useTheme, Tooltip as MuiTooltip, Paper } from "@mui/material";
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// data needs to be an array of objects. These objects should have
// properties that are numbers. x and y need to the names of the
// x and y coordinates that you wish to use.

// xLabel is going to be a string that will be displayed as the label on the x axis.
// Similarly for the yLabel.
export default function ScatterPlot({ data, x, y, xLabel, yLabel }) {
  // This grabs the theme from MUI.
  const theme = useTheme();
console.log('data is:', data, "x is:", x, "y is:", y, 'xLabel is:', xLabel, "yLabel is:", yLabel)
  // Define the color dependent on the temperature reading.
  const fillColor = (temp) => {
    let fill = "";
    if (parseFloat(temp) > 42) {
      fill = theme.palette.error.main;
    } else if (parseFloat(temp) > 39 && parseFloat(temp) < 43) {
      fill = theme.palette.warning.main;
    } else {
      fill = theme.palette.success.main;
    }
    return fill;
  };

  const enrichedData = data.map((entry) => ({
    ...entry,
    fill: fillColor(entry.temperature), // Add the fill color based on temperature
  }));

  //Formatter function for the graph tick marks on the Axes
  const formatTick = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? '' : num.toFixed(3);
  };
  

  const tooltipRenderFn = ({ active, payload, label }) => {
    if (active && payload && payload.length)
      return (
        <Paper sx={{p:1}} elevation={2}>
          <p>
            Temperature: {payload[0].payload.temperature}ºF
          </p>
          <p>{xLabel}: {payload[0].payload[x]}</p>
          <p>{yLabel}: {payload[0].payload[y]}</p>  
        </Paper>
      );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={x}
          type="number"
          label={{ value: xLabel, position: "bottom" }}
          // This looks funny. I know. ReCharts allows for callback functions in calculating
          // the domain (AKA, the upper and lower bounds of the graph, where the edges are).
          // This is basically finding the range, and then adding 10% to it.
          domain={([dataMin, dataMax]) => {
            const min = isNaN(dataMin) ? 0 : dataMin;
            const max = isNaN(dataMax) ? 1 : dataMax;
            return [min - (max - min) * 0.1, max + (max - min) * 0.1];
          }}
          
          // Helper function to round the displays of the ticks to be three decimal places.
          // Does not affect functionality, only visuals.
          tickFormatter={formatTick}
          interval={"preserveStartEnd"}
        />
        <YAxis
          dataKey={y}
          type="number"
          label={{ value: yLabel, angle: -90, position: "left" }}
          // See notes above for explanation. Same logic.
          domain={([dataMin, dataMax]) => {
            const min = isNaN(dataMin) ? 0 : dataMin;
            const max = isNaN(dataMax) ? 1 : dataMax;
            return [min - (max - min) * 0.1, max + (max - min) * 0.1];
          }}
          
          // Helper function to round the displays of the ticks to be three decimal places.
          // Does not affect functionality, only visuals.
          tickFormatter={formatTick}
          interval={"preserveStartEnd"}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={tooltipRenderFn}
        />
        <Scatter data={enrichedData} fill={enrichedData.temperature} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
