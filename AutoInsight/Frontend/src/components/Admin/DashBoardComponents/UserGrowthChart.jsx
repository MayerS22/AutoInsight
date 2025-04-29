/* eslint-disable react/prop-types */
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const UserGrowthChart = ({ data }) => {
  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-lg font-bold mb-2">User Growth Over Time</h2>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -40, bottom: 10 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis tick={{ fontSize: 10 }} domain={[0, "auto"]} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6d28d9"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;
