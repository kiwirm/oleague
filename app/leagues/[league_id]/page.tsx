import { Badge } from "@/components/badge";
import ListItem from "@/components/list-row";
import Navbar from "@/components/navbar";
import Subtitle from "@/components/subtitle";
import TextWithIcon from "@/components/text-with-icon";
import Title from "@/components/title";

import prisma from "@/lib/prisma";

import { notFound } from "next/navigation";
import pluralize from "pluralize";

export async function generateStaticParams() {
  const leagues = await prisma.league.findMany({
    select: {
      league_id: true,
    },
  });

  const paths = leagues.map((league) => ({
    league_id: league.league_id.toString().toLowerCase(),
  }));

  return paths;
}
await prisma.$disconnect();

export default async function LeaguePage(props: {
  params: Promise<{ league_id: string }>;
}) {
  const params = await props.params;
  const league = await prisma.league.findUnique({
    where: {
      league_id: params.league_id.toUpperCase(),
    },
    include: {
      season: {
        include: {
          event: true,
          grade: true,
          league: true,
          competitor: true,
        },
        orderBy: {
          season_id: "desc",
        },
      },
    },
  });

  if (league === null) {
    return notFound();
  }
  return (
    <>
      <Navbar
        breadcrumbLinks={[
          { href: "/", text: "oleagues.nz" },
          { href: "/leagues", text: "Leagues" },
          { href: `/leagues/${league.league_id}`, text: league.name! },
        ]}
      />

      <Title>{league.name}</Title>

      <div className="mb-4 text-muted-foreground">
        <TextWithIcon
          text={pluralize("seasons", league.season.length, true)}
          icon="sunny"
        />
      </div>

      <Subtitle>Seasons</Subtitle>
      <div>
        {league.season.map((season) => (
          <ListItem
            href={`/leagues/${league.league_id}/${season.season_id}`}
            key={season.season_id}
            header={
              <>
                <Badge className="mr-2">
                  {season.provisional ? "Provisional" : "Final"}
                </Badge>
                {season.season_id + " Season"}
              </>
            }
            summary={
              <>
                <TextWithIcon
                  text={pluralize("events", season.event.length, true)}
                  icon="forest"
                />
                <TextWithIcon
                  text={pluralize(
                    "competitors",
                    season.competitor.length,
                    true
                  )}
                  icon="sprint"
                />
                <TextWithIcon
                  text={pluralize("grades", season.grade.length, true)}
                  icon="receipt_long"
                />
              </>
            }
          />
        ))}
      </div>
    </>
  );
}
