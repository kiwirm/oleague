"use client";

import { ChartConfig } from "@/components/ui/chart";
import { event as event_prisma } from "@prisma/client";

export default function PointsChart({
  competitors,
  events,
}: {
  competitors: CompetitorWithPoints[];
  events: event_prisma[];
}) {
  const chartConfig: ChartConfig = Object.fromEntries(
    competitors.map((competitor, index) => [
      `chart${index + 1}`,
      {
        label: competitor.orienteer?.full_name ?? "Unknown",
        color: `hsl(var(--chart-${index + 1}))`,
      },
    ])
  );

  const placingsAfterEvent = (oevent: event_prisma) =>
    competitors.map((competitor) => ({
      [competitor.onz_id]: +competitor.points
        .filter((points) => points.event_number <= oevent.event_number)
        .reduce((sum, point) => sum + +point.points!, 0),
    }));

  const cumulativePointsData = events.map((oevent, index) => {
    const placings = placingsAfterEvent(oevent);
    return {
      event: oevent.event_number || `Event ${index + 1}`,
      ...Object.assign({}, ...placings),
    };
  });

  return "hi";
}
