// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
// import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

// export default function Chart({data, xKey}) {
//     <div className="card p-4 bg-base-100">
//       <h3 className="text-lg font-semibold mb-4">Cumulative Points</h3>
//       <ChartContainer config={chartConfig}>
//         <LineChart accessibilityLayer data={cumulativePointsData}>
//           <CartesianGrid vertical={false} />
//           <XAxis
//             dataKey={xKey}
//             angle={-45}
//             textAnchor="end"
//             height={50}
//             interval={0}
//             tick={{
//               dy: 10,
//               dx: -5,
//             }}
//           />
//           <YAxis />
//           <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
//           <Legend />
//           {data.map((datapoint, index) => (
//             <Line
//               key={datapoint.onz_id}
//               type="monotone"
//               dataKey={competitor.onz_id.toString()}
//               name={competitor.orienteer?.full_name ?? "Unknown"}
//               strokeWidth={3}
//               stroke={`hsl(var(--chart-${index + 1}))`}
//               dot={false}
//               isAnimationActive={false}
//             />
//           ))}
//         </LineChart>
//       </ChartContainer>
//     </div>
//   );
// }
