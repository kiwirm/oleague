"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart";

import { GradeIncludeAll } from "@/lib/prisma";

import { points, Prisma } from "@prisma/client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const MedalsChart = ({
  grade,
}: {
  grade: Prisma.gradeGetPayload<typeof GradeIncludeAll>;
}) => {
  const medalData = grade.competitor.slice(0, 5).map((competitor) => {
    const medals = competitor.points.reduce(
      (
        accumulator: { gold: number; silver: number; bronze: number },
        eventPoints: points
      ) => {
        if (Number(eventPoints.placing) === 1) accumulator.gold++;
        else if (Number(eventPoints.placing) === 2) accumulator.silver++;
        else if (Number(eventPoints.placing) === 3) accumulator.bronze++;
        return accumulator;
      },
      { gold: 0, silver: 0, bronze: 0 }
    );

    return {
      name: competitor.orienteer.full_name,
      ...medals,
    };
  });

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
};

export default MedalsChart;
