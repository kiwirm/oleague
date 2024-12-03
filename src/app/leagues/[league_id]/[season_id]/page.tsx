import ListItem from "@/components/list_item";
import Navbar from "@/components/navbar";
import PageSubtitle from "@/components/page_subtitle";
import PageTitle from "@/components/page_title";
import TextWithIcon from "@/components/text_with_icon";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const iconMap = {
  FOR: "forest",
  SPR: "location_city",
  MTB: "directions_bike",
  NGT: "partly_cloudy_night",
  SCO: "workspaces",
};

export async function generateStaticParams() {
  const leagues = await prisma.league.findMany({
    select: {
      league_id: true,
      season: {
        select: {
          season_id: true,
        },
      },
    },
  });

  const paths = leagues.flatMap((league) =>
    league.season.map((season) => ({
      league_id: league.league_id.toString(),
      season_id: season.season_id.toString(),
    }))
  );
  return paths;
}

export default async function LeagueSeasonPage(
  props: {
    params: Promise<{ league_id: string; season_id: string }>;
  }
) {
  const params = await props.params;
  const season = await prisma.season.findUnique({
    where: {
      league_id_season_id: {
        league_id: params.league_id,
        season_id: params.season_id,
      },
    },
    include: {
      league: true,
      competitor: true,
      grade: {
        include: {
          competitor: {
            include: { orienteer: true },
            orderBy: { placing: "asc" },
          },
        },
        orderBy: {
          difficulty: "desc",
        },
      },
      event: {
        include: {
          points_sparse: true,
          race: {
            include: {
              result: true,
            },
          },
        },
      },
    },
  });

  if (season === null) {
    return notFound();
  }

  return (
    <>
      <Navbar
        breadcrumbLinks={[
          { href: "/", text: "oleagues.nz" },
          { href: "/leagues", text: "Leagues" },
          {
            href: `/leagues/${season.league.league_id}`,
            text: season.league.name!,
          },
          {
            href: `/leagues/${season.league.league_id}/${season.season_id}`,
            text: season.season_id + " Season",
          },
        ]}
      />
      <PageTitle>
        <div className="flex flex-col">
          {season.season_id + " Season"}
          <Badge className="w-min mt-2">
            {season.provisional ? "Provisional" : "Final"}
          </Badge>
        </div>
      </PageTitle>
      <div className="mb-4 text-muted-foreground">
        <span className="mr-4">
          <TextWithIcon text={season.event.length + " Events"} icon="forest" />
        </span>
        <span className="mr-4">
          <TextWithIcon
            text={season.competitor.length + " Competitors"}
            icon="sprint"
          />
        </span>
        <span>
          <TextWithIcon
            text={season.grade.length + " Grades"}
            icon="receipt_long"
          />
        </span>
      </div>
      <PageSubtitle>Events</PageSubtitle>
      {season.event.map((oevent) => (
        <ListItem
          key={oevent.event_number}
          href={`${oevent.season_id}/events/${oevent.event_number}`}
          header={
            <TextWithIcon
              icon={iconMap[oevent.race[0].discipline]}
              text={
                "OY" +
                oevent.event_number +
                " " +
                oevent.race.map((race) => race.map).join(", ")
              }
            />
          }
          summary={
            <>
              <TextWithIcon
                text={oevent.points_sparse.length + " Competitors"}
                icon="sprint"
              />
              <TextWithIcon
                text={
                  oevent.race.length +
                  (oevent.race.length > 1 ? " Races" : " Race")
                }
                icon="sports_score"
              />
            </>
          }
        />
      ))}
      <PageSubtitle>Grades</PageSubtitle>
      {season.grade.map((grade) => (
        <ListItem
          key={grade.grade_id}
          href={`${grade.season_id}/grades/${grade.grade_id}/results`}
          header={grade.name}
          summary={
            grade.competitor[0].orienteer ? (
              <TextWithIcon
                text={grade.competitor[0].orienteer.full_name!}
                icon="trophy"
              />
            ) : undefined
          }
        />
      ))}
    </>
  );
}
