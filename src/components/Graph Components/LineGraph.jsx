import React, {PureComponent} from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

export default function LineGraph({ data, x, y, xLabel, yLabel }) {
    const formatTick = (value) => {
        return parseFloat(value).toFixed(3);
      };

  return (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart
        data={data}
        margin={{ top: 100, right: 30, left: 30, bottom: 100 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
        dataKey={x}
        label={{value: xLabel, position: "bottom"}} 
        tick={{angle: -45, dy: 30, dx: -30}}
    
        // domain={([dataMin, dataMax]) => {
        //     return [
        //       dataMin - (dataMax - dataMin) * 0.1,
        //       dataMax + (dataMax - dataMin) * 0.1,
        //     ];}} 
        />
        <YAxis
        label={{value: yLabel, position: "left", angle: -90}}
        domain={([dataMin, dataMax]) => {
            return [
              dataMin - (dataMax - dataMin) * 0.1,
              dataMax + (dataMax - dataMin) * 0.1,
            ];}}
            tickFormatter={formatTick}
         />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={y}
          stroke="#8884d8"
          activeDot={{ r: 8 }}          
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
