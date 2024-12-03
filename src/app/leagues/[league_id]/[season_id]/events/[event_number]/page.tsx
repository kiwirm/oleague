import PageSubtitle from "@/components/page_subtitle";
import PageTitle from "@/components/page_title";

import ListItem from "@/components/list_item";
import Navbar from "@/components/navbar";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Fragment } from "react";

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

export default async function EventPage({
  params,
}: {
  params: { league_id: string; season_id: string; event_number: string };
}) {
  const oevent = await prisma.event.findUnique({
    where: {
      league_id_season_id_event_number: {
        league_id: params.league_id,
        season_id: params.season_id,
        event_number: +params.event_number,
      },
    },
    include: {
      race: { include: { grade_mapping: { include: { grade: true } } } },
      season: { include: { grade: true, league: true } },
    },
  });

  if (oevent === null) {
    return notFound();
  }

  const pageTitle = `OY ${oevent!.event_number} ${oevent!.race
    .map((race) => race.map)
    .join(" ")}`;

  return (
    <>
      <Navbar
        breadcrumbLinks={[
          { href: "/", text: "oleagues.nz" },
          { href: "/leagues", text: "Leagues" },
          {
            href: `/leagues/${oevent.season.league.league_id}`,
            text: oevent.season.league.name!,
          },
          {
            href: `/leagues/${oevent.season.league.league_id}/${oevent.season.season_id}`,
            text: oevent.season.season_id + " Season",
          },
          {
            href: `/leagues/${oevent.season.league.league_id}/${oevent.season.season_id}/events/${oevent.event_number}`,
            text: pageTitle,
          },
        ]}
      />
      <PageTitle>{pageTitle}</PageTitle>
      {oevent.race.map((race) => (
        <Fragment key={race.race_number}>
          <PageSubtitle>
            Race {race.race_number}: {race.map}
          </PageSubtitle>
          {race.grade_mapping.map((race_grade) => (
            <ListItem
              key={race_grade.race_grade}
              header={race_grade.grade.name}
              href={"none"}
              summary={"Race splits not yet available"}
            />
          ))}
        </Fragment>
      ))}
    </>
  );
}
