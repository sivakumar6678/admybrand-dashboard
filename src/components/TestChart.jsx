import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const testData = [
  { name: "Jan", value: 100 },
  { name: "Feb", value: 200 },
  { name: "Mar", value: 150 }
];

export default function TestChart() {
  return (
    <div className="w-full h-[300px] bg-white border rounded p-4">
      <h3 className="text-lg font-bold mb-4">Test Chart</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={testData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="value" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}