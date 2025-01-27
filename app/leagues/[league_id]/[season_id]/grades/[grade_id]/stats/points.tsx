"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart";
import { GradeIncludeAll } from "@/lib/prisma";
import { pointsAfterEvent } from "@/lib/stats";

import { Prisma } from "@prisma/client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const PointsChart = ({
  grade,
}: {
  grade: Prisma.gradeGetPayload<typeof GradeIncludeAll>;
}) => {
  const cumulativePointsData = grade.season.event.map((oevent) => ({
    event: oevent.race.map((race) => race.map).join(", "),
    ...pointsAfterEvent(grade, oevent, grade.season.last_event),
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
};

export default PointsChart;
