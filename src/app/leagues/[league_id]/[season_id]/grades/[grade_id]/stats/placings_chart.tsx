"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Prisma, event as event_prisma } from "@prisma/client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { GradeWithIncludes } from "./page";

export default function PlacingsChart({
  grade,
  events,
}: {
  grade: Prisma.gradeGetPayload<typeof GradeWithIncludes>;
}) {
  const chartConfig: ChartConfig = Object.fromEntries(
    grade.competitor.slice(0, 5).map((competitor, index) => [
      `chart${index + 1}`,
      {
        label: competitor.onz_id,
        color: `hsl(var(--chart-${index + 1}))`,
      },
    ])
  );

  const placingsAfterEvent = (oevent: event_prisma) =>
    grade.competitor.map((competitor) => ({
      [competitor.onz_id]: +competitor.points
        .filter((points) => points.event_number <= oevent.event_number)
        .reduce((sum, point) => sum + +point.points!, 0),
    }));

  const placingsData = grade.season.event.map((oevent) => {
    const sortedCompetitors = Object.entries(placingsAfterEvent(oevent)).sort(
      (a, b) => (b[1] as unknown as number) - (a[1] as unknown as number)
    );

    return {
      event: oevent.race.map((race) => race.map).join(", "),
      ...Object.fromEntries(
        sortedCompetitors.map((competitor, index) => [competitor, index + 1])
      ),
    };
  });

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold mb-4">Placings Over Time</h3>
      <ChartContainer config={chartConfig}>
        <LineChart accessibilityLayer data={placingsData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="event"
            name="Event"
            angle={-45}
            textAnchor="end"
            height={200}
            interval={0}
            tick={{
              dy: 10,
              dx: -5,
            }}
          />
          <YAxis reversed />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
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
    </div>
  );
}
