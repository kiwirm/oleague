"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart";

import { Prisma } from "@prisma/client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { GradeIncludeAll } from "@/lib/prisma";
import { pointsAfterEvent } from "@/lib/stats";

const PlacingsChart = ({
  grade,
}: {
  grade: Prisma.gradeGetPayload<typeof GradeIncludeAll>;
}) => {
  const placingsData = grade.season.event.map((oevent) => {
    const sortedCompetitors = Object.entries(
      pointsAfterEvent(grade, oevent)
    ).sort((a, b) => b[1] - a[1]);

    //TODO: use true (rank) placing here
    return {
      event: oevent.race.map((race) => race.map).join(", "),
      ...Object.fromEntries(
        sortedCompetitors.map(([competitor, points], index) => [
          competitor,
          points ? index + 1 : null,
        ])
      ),
    };
  });

  //TODO: fix the chart legend
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer
        config={Object.fromEntries(
          grade.competitor.slice(0, 5).map((competitor, index) => [
            `chart${index + 1}`,
            {
              label: competitor.orienteer?.full_name ?? "Unknown",
              color: `hsl(var(--chart-${index + 1}))`,
            },
          ])
        )}
      >
        <LineChart accessibilityLayer data={placingsData}>
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
          <YAxis
            reversed
            domain={[1, "dataMax"]}
            label={{
              value: "Place",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
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

export default PlacingsChart;
