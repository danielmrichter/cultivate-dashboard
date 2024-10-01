import { useTheme, Paper } from "@mui/material";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";

// data needs to be an array of objects. These objects should have
// properties that are numbers. x and y need to the names of the
// x and y coordinates that you wish to use.

// Note: The bar graph will always display in order of the array from left to right.
// Sort it before passing to this BarGraph.

// xLabel is going to be a string that will be displayed as the label on the x axis.
// Similarly for the yLabel.
export default function BarGraph({ data, x, y, xLabel, yLabel }) {
  // This grabs the theme from MUI.
  const theme = useTheme();

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
    return parseFloat(value).toFixed(3);
  };

  const tooltipRenderFn = ({ active, payload, label }) => {
    if (active && payload && payload.length)
      return (
        <Paper sx={{ p: 1 }} elevation={2}>
          <p>Temperature: {payload[0].payload.temperature}ºF</p>
          <p>
            {xLabel}: {payload[0].payload[x]}
          </p>
          <p>
            {yLabel}: {payload[0].payload[y]}
          </p>
        </Paper>
      );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        margin={{
          top: 15,
          right: 15,
          bottom: 15,
          left: 15,
        }}
        data={enrichedData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={x}
          label={{ value: xLabel, position: "bottom" }}
          interval={"preserveStartEnd"}
        />
        <YAxis
          dataKey={y}
          type="number"
          label={{ value: yLabel, angle: -90, position: "left" }}
          // This looks funny. I know. ReCharts allows for callback functions in calculating
          // the domain (AKA, the upper and lower bounds of the graph, where the edges are).
          // This is basically finding the range, and then adding 10% to it.
          domain={([dataMin, dataMax]) => {
            return [
              dataMin - (dataMax - dataMin) * 0.1,
              dataMax + (dataMax - dataMin) * 0.1,
            ];
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
        <Bar
          data={enrichedData}
          dataKey="temperature"
          activeBar={<Rectangle fill={enrichedData.temperature} />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
