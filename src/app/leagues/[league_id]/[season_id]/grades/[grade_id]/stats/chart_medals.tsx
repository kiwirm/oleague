"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Prisma } from "@prisma/client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { GradeWithIncludes } from "./page";

export default function MedalsChart({
  grade,
}: {
  grade: Prisma.gradeGetPayload<typeof GradeWithIncludes>;
}) {
  const medalData = grade.competitor.slice(0, 5).map((competitor) => {
    const medals = competitor.points.reduce(
      (acc, point) => {
        if (Number(point.placing) === 1) acc.gold++;
        else if (Number(point.placing) === 2) acc.silver++;
        else if (Number(point.placing) === 3) acc.bronze++;
        return acc;
      },
      { gold: 0, silver: 0, bronze: 0 }
    );

    return {
      name: competitor.orienteer?.full_name ?? "Unknown",
      ...medals,
    };
  });

  // Calculate height based on number of competitors
  const rowHeight = 40; // Height per row
  const marginHeight = 50; // Total margin (top + bottom)
  const chartHeight = medalData.length * rowHeight + marginHeight;

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
        <BarChart accessibilityLayer data={medalData} layout="vertical">
          <CartesianGrid horizontal={false} />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} interval={0} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="gold" name="Gold" stackId="a" fill="#FFD700" />
          <Bar dataKey="silver" name="Silver" stackId="a" fill="#C0C0C0" />
          <Bar dataKey="bronze" name="Bronze" stackId="a" fill="#CD7F32" />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
