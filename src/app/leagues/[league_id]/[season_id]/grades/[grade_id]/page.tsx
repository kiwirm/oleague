import prisma from "@/lib/prisma";
import ColHeader from "./col_header";

import RowTotals from "./row_totals";
import RowHeader from "./row_header";
import ResultCell from "./result_cell";
import PageTitle from "@/components/page_title";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const leagues = await prisma.league.findMany({
    select: {
      league_id: true,
      season: {
        select: {
          season_id: true,
          event: {
            select: {
              event_number: true,
            },
          },
        },
      },
    },
  });

  const paths = leagues.flatMap((league) =>
    league.season.flatMap((season) =>
      season.event.map((event) => ({
        league_id: league.league_id.toString(),
        season_id: season.season_id.toString(),
        event_number: event.event_number.toString(),
      }))
    )
  );

  return paths;
}

export default async function PointsPage({
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
          league: true,
          event: { include: { race: true } },
        },
      },
    },
  });
  if (grade === null) {
    return notFound();
  }

  return (
    <>
      <Breadcrumbs
        links={[
          { href: "/", text: "oleagues.nz" },
          { href: "/leagues", text: "Leagues" },
          {
            href: `/leagues/${grade.season.league.league_id}`,
            text: grade.season.league.name!,
          },
          {
            href: `/leagues/${grade.season.league.league_id}/${grade.season.season_id}`,
            text: grade.season.season_id + " Season",
          },
          {
            href: `/leagues/${grade.season.league.league_id}/${grade.season.season_id}/${grade.grade_id}`,
            text: grade.name,
          },
        ]}
      />
      <PageTitle>{grade.name}</PageTitle>
      <table className="mt-40 border-collapse">
        <thead>
          <tr className="border-b">
            <th className="w-2 text-right">
              {grade.season.provisional ? "Current Placing" : "Place"}
            </th>
            <th className="w-40 text-left pl-4">Competitor</th>
            {grade.season.event.map((oevent) => ColHeader(oevent))}
            <th className="text-right w-20 pr-3">Points</th>
          </tr>
        </thead>
        <tbody>
          {grade.competitor.map((competitor) => (
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
