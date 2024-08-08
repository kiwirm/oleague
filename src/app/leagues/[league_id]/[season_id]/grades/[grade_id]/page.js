import prisma from "@/lib/prisma";
import ColHeader from "./col_header";

import RowTotals from "./row_totals";
import RowHeader from "./row_header";
import ResultCell from "./result_cell";
import PageTitle from "@/components/page_title";

export default async function PointsPage({
  params: { league_id, season_id, grade_id },
}) {
  const grade = await prisma.grade.findUnique({
    where: {
      league_id_season_id_grade_id: {
        league_id: league_id,
        season_id: season_id,
        grade_id: grade_id,
      },
    },
  });
  const season = await prisma.season.findUnique({
    where: {
      league_id_season_id: {
        league_id: league_id,
        season_id: season_id,
      },
    },
    include: {
      league: true,
      event: { include: { race: true } },
      competitor: {
        where: { grade_id: grade_id },
        include: {
          points: true,
          orienteer: true,
        },
        orderBy: {
          placing: "asc",
        },
      },
    },
  });

  return (
    <>
      <PageTitle
        title={grade.name}
        subtitle={season.season_id + " Season (" + season.league.name + ")"}
        subtitle_href={"../"}
      />
      <table className="mt-40 border-collapse">
        <thead>
          <tr className="border-b">
            <th className="w-2 text-right">
              {season.provisional ? "Current Placing" : "Place"}
            </th>
            <th className="w-40 text-left pl-4">Competitor</th>
            {season.event.map((oevent) => ColHeader(oevent))}
            <th className="text-right w-20 pr-3">Points</th>
          </tr>
        </thead>
        <tbody>
          {season.competitor.map((competitor) => (
            <tr
              key={competitor.onz_id}
              className="odd:bg-white even:bg-gray-50"
            >
              {RowHeader(competitor)}
              {competitor.points.map((point) => ResultCell(competitor, point))}
              {RowTotals(competitor)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
