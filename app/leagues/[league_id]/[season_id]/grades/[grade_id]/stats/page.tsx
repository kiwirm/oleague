import prisma from "@/lib/prisma";

import { notFound } from "next/navigation";

import MedalsChart from "./medals";
import PlacingsChart from "./placings";
import PointsChart from "./points";

export default async function StatsPage(props: {
  params: Promise<{ league_id: string; season_id: string; grade_id: string }>;
}) {
  const params = await props.params;
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
          event: { include: { race: true } },
        },
      },
    },
  });
  await prisma.$disconnect();

  if (!grade) {
    return notFound();
  }

  // TODO make different competitors selectable
  const selectedCompetitors = grade.competitor.map((competitor) => [
    competitor.onz_id,
    competitor.points,
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
      <div className="flex flex-col items-center">
        <h1 className="mt-6 mb-2 font-bold text-xl font-title">
          Accumulated points
        </h1>
        <div className="h-72 w-full">
          <PointsChart grade={grade} />
        </div>
      </div>
      <div className="flex flex-col items-center font-title">
        <h1 className="mt-6 mb-2 font-bold text-xl">Placings over time</h1>
        <div className="h-72 w-full">
          <PlacingsChart grade={grade} />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="mt-6 mb-2 font-bold text-xl font-title">
          Medal allocation
        </h1>
        <div className="h-72 w-full">
          <MedalsChart grade={grade} />
        </div>
      </div>
    </div>
  );
}
