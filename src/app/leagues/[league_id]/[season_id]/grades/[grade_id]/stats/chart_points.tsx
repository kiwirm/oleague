"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Prisma } from "@prisma/client";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { pointsAfterEvent } from "./chart";
import { GradeWithIncludes } from "./page";

export default function PointsChart({
  grade,
}: {
  grade: Prisma.gradeGetPayload<typeof GradeWithIncludes>;
}) {
  const cumulativePointsData = grade.season.event.map((oevent, index) => ({
    event: oevent.race.map((race) => race.map).join(", "),
    ...pointsAfterEvent(grade, oevent),
  }));

  return (
    <ResponsiveContainer height="100%" width="100%">
      <ChartContainer
        config={Object.fromEntries(
          grade.competitor.slice(0, 10).map((competitor, index) => [
            `chart${index + 1}`,
            {
              label: competitor.orienteer?.full_name ?? "Unknown",
              color: `hsl(var(--chart-${index + 1}))`,
            },
          ])
        )}
      >
        <LineChart
          accessibilityLayer
          data={cumulativePointsData}
          height={300}
          width={300}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="event"
            name="Event"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{
              dy: 10,
              dx: -5,
            }}
          />
          <YAxis />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          {/* <ChartLegend content={<ChartLegendContent />} /> */}
          {grade.competitor.slice(0, 5).map((competitor, index) => (
            <Line
              key={competitor.onz_id}
              type="monotone"
              dataKey={competitor.onz_id}
              name={competitor.orienteer?.full_name ?? "Unknown"}
              strokeWidth={3}
              stroke={`hsl(var(--chart-${index + 1}))`}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
