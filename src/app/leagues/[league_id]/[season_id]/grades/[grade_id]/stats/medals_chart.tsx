"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Prisma } from "@prisma/client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// ... (keep the GradeWithIncludes type definition)

export default function MedalsChart({
  grade,
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

  const medalData = grade.competitor.slice(0, 5).map((competitor) => {
    const medals = competitor.points.reduce(
      (acc, point) => {
        // if (point.placing === 1) acc.gold++;
        // else if (point.placing === 2) acc.silver++;
        // else if (point.placing === 3) acc.bronze++;
        return acc;
      },
      { gold: 0, silver: 0, bronze: 0 }
    );

    return {
      name: competitor.orienteer?.full_name ?? "Unknown",
      ...medals,
    };
  });

  return (
    <div className="card p-4 bg-base-100 shadow-xl">
      <h3 className="text-lg font-semibold mb-4">Medal Distribution</h3>
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={medalData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid horizontal={false} />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="gold"
            name="Gold"
            stackId="a"
            fill="hsl(var(--chart-1))"
          />
          <Bar
            dataKey="silver"
            name="Silver"
            stackId="a"
            fill="hsl(var(--chart-2))"
          />
          <Bar
            dataKey="bronze"
            name="Bronze"
            stackId="a"
            fill="hsl(var(--chart-3))"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
