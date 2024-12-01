import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import PointsChart from "./points_chart";

export const GradeWithIncludes = Prisma.validator<Prisma.gradeDefaultArgs>()({
  include: {
    competitor: {
      include: {
        points: true,
        orienteer: true,
      },
    },
    season: {
      include: {
        event: {
          include: {
            race: true,
          },
        },
      },
    },
  },
});

export default async function StatsPage({
  params,
}: {
  params: { league_id: string; season_id: string; grade_id: string };
}) {
  const grade = await prisma.grade.findUnique({
    where: {
      league_id_season_id_grade_id: {
        league_id: params.league_id,
        season_id: params.season_id,
        grade_id: params.grade_id,
      },
    },
    include: {
      competitor: {
        where: { grade_id: params.grade_id },
        include: {
          points: true,
          orienteer: true,
        },
        orderBy: {
          placing: "asc",
        },
      },
      season: {
        include: {
          event: true,
        },
      },
    },
  });

  if (!grade) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PointsChart
        competitors={grade.competitor.slice(0, 5)}
        events={grade.season.event}
      />
      {/* <PlacingsChart grade={grade} /> */}
      {/* <MedalsChart grade={grade} /> */}
    </div>
  );
}
