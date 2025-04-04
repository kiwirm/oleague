import prisma from "@/lib/prisma";

import { notFound } from "next/navigation";

import Cell from "./cell";
import CompetitorHeader from "./competitor-header";
import EventHeader from "./event-header";
import PointTotal from "./point-total";

export async function generateStaticParams() {
  const grades = await prisma.grade.findMany({
    select: {
      league_id: true,
      season_id: true,
      grade_id: true,
    },
  });
  await prisma.$disconnect();

  return grades.map((grade) => ({
    league_id: grade.league_id.toLowerCase(),
    season_id: grade.season_id,
    grade_id: grade.grade_id.toLowerCase(),
  }));
}

const ResultsPage = async (props: {
  params: Promise<{ league_id: string; season_id: string; grade_id: string }>;
}) => {
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
          points_dense: true,
          orienteer: true,
        },
        orderBy: {
          placing: "asc",
        },
      },
      season: {
        include: {
          event: {
            include: { race: true },
          },
        },
      },
    },
  });
  await prisma.$disconnect();

  if (!grade) {
    return notFound();
  }

  return (
    <div className="relative max-w-full overflow-x-auto">
      <div className="w-32 h-32 sticky left-0 bg-white z-10"></div>
      <table className="relative w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-2 border-r">
              {/* {grade.season.provisional ? "Current Placing" : "Place"} */}
              Place
            </th>
            <th className="sticky bg-background left-0 z-10 w-32 border-r">
              Competitor
            </th>
            {grade.season.event.map((oevent) => (
              <EventHeader key={oevent.event_number} event={oevent} />
            ))}
            <th className="text-right w-20 pr-3 border-l">Points</th>
          </tr>
        </thead>
        <tbody>
          {grade.competitor.map((competitor) => (
            <tr
              key={competitor.onz_id}
              className="odd:bg-white even:bg-gray-50"
            >
              <CompetitorHeader
                competitor={competitor}
                displayEligibility={grade.season.events_min > 1}
              />
              {competitor.points_dense.map((eventPoints) => (
                <Cell
                  key={eventPoints.event_number}
                  eligible={competitor.eligibility_id !== "INEL"}
                  points={eventPoints}
                />
              ))}
              <PointTotal competitor={competitor} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsPage;
