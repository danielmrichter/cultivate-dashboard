import { useTheme, Paper } from "@mui/material";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

// Define the interface for the data entries
interface DataEntry {
  temperature: number; // Assuming temperature is a number
  [key: string]: any; // Allows for additional properties
}

// Define the props for the BarGraph component
interface BarGraphProps {
  data: DataEntry[]; // An array of DataEntry objects
  x: string;         // The key for the x-axis
  y: string;         // The key for the y-axis
  xLabel: string;    // Label for the x-axis
  yLabel: string;    // Label for the y-axis
}

export default function BarGraph({ data, x, y, xLabel, yLabel }: BarGraphProps) {
  const theme = useTheme();

  // Define the color dependent on the temperature reading.
  const fillColor = (temp: number) => {
    let fill = "";
    if (temp > 42) {
      fill = theme.palette.error.main;
    } else if (temp > 39 && temp < 43) {
      fill = theme.palette.warning.main;
    } else {
      fill = theme.palette.success.main;
    }
    return fill;
  };

  // Validate date values before sorting
  const isValidDate = (dateString: string) => !isNaN(new Date(dateString).getTime());

  const sortedData = [...data].sort((a, b) => {
    const dateA = isValidDate(a[x]) ? new Date(a[x]) : new Date(0); // Default to epoch
    const dateB = isValidDate(b[x]) ? new Date(b[x]) : new Date(0); // Default to epoch
    return dateA.getTime() - dateB.getTime(); // Ensure to get the time in milliseconds
  });

  const enrichedData = sortedData.map((entry) => ({
    ...entry,
    fill: fillColor(entry[y]),
  }));

  const formatTick = (value: number) => {
    return value.toFixed(3);
  };

  const tooltipRenderFn = ({ active, payload }: any) => {
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

  const CustomBar = (props: any) => {
    const { x, y, width, height, fill } = props;
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={props.payload.fill} // Use the fill from the payload
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        margin={{
          top: 15,
          right: 15,
          bottom: 25,
          left: 15,
        }}
        data={enrichedData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={x}
          type="category"
          label={{ value: xLabel, position: "bottom" }}
          interval={"preserveStartEnd"}
        />
        <YAxis
          dataKey={y}
          type="number"
          label={{ value: yLabel, angle: -90, position: "left" }}
          domain={([dataMin, dataMax]) => {
            const min = typeof dataMin === 'number' ? dataMin : 0; // default to 0 if not a number
            const max = typeof dataMax === 'number' ? dataMax : 1; // default to 1 if not a number
            return [
              min - (max - min) * 0.1,
              max + (max - min) * 0.1,
            ];
          }}
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
          shape={<CustomBar />} // Use the custom shape for dynamic fills
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
