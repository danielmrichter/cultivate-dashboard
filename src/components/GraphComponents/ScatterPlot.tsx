import { useTheme, Paper } from "@mui/material";
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
// properties that are numbers. x and y need to be the names of the
// x and y coordinates that you wish to use.

// xLabel is going to be a string that will be displayed as the label on the x axis.
// Similarly for the yLabel.
export default function ScatterPlot({ data, x, y, xLabel, yLabel, temp }) {
  // This grabs the theme from MUI.
  const theme = useTheme();

  // Define the color dependent on the temperature reading.
  const fillColor = (temp) => {
    let fill = "";
    if (temp > 42) {
      fill = theme.palette.error.main;
    } else if (temp >= 39 && temp < 43) {
      fill = theme.palette.warning.main;
    } else {
      fill = theme.palette.success.main;
    }
    return fill;
  };

  // Map the data to enrich it with the fill color based on temperature.
  const enrichedData = data.map((entry) => ({
    ...entry,
    fill: fillColor(entry[temp]), // Add the fill color based on temperature
  }));

  // Formatter function for the graph tick marks on the Axes
  const formatTick = (value) => {
    const num = parseFloat(value).toFixed(3);
    return num;
  };

  // Function to render the custom tooltip content
  const tooltipRenderFn = ({ active, payload, label }) => {
    if (active && payload && payload.length)
      return (
        <Paper sx={{ p: 1 }} elevation={2}>
          <p>Temperature: {payload[0].payload[temp]}ºF</p>
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
    <ResponsiveContainer
      width="100%"
      height="100%"
      style={{ marginBottom: "20px", marginLeft: "15px" }}
    >
      <ScatterChart margin={{ bottom: 60, left: 30, right: 20, top: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={x}
          type={typeof x === "number" ? "number" : "category"}
          label={{ value: xLabel, position: "bottom", offset: 40 }}
          {...(typeof x === "number"
            ? {
                domain: ([dataMin, dataMax]) => [
                  dataMin - (dataMax - dataMin) * 0.1,
                  dataMax + (dataMax - dataMin) * 0.1,
                ],
                tickFormatter: formatTick,
              }
            : {
                tick: (props) => {
                  const { x, y, payload } = props;
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={15}
                        textAnchor="end"
                        transform="rotate(-45)"
                        fill="#666"
                      >
                        {payload.value}
                      </text>
                    </g>
                  );
                },
              })}
          interval={"preserveStartEnd"}
        />
        <YAxis
          dataKey={y}
          type="number"
          label={{
            value: yLabel,
            angle: -90,
            position: "left",
            offset: 20,
          }}
          domain={([dataMin, dataMax]) => [
            dataMin - (dataMax - dataMin) * 0.1,
            dataMax + (dataMax - dataMin) * 0.1,
          ]}
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
