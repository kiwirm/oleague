import ListItem from "@/components/list_item";
import Navbar from "@/components/navbar";
import PageSubtitle from "@/components/page_subtitle";
import PageTitle from "@/components/page_title";
import TextWithIcon from "@/components/text_with_icon";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const leagues = await prisma.league.findMany({
    select: {
      league_id: true,
    },
  });

  const paths = leagues.map((league) => ({
    league_id: league.league_id.toString(),
  }));

  return paths;
}

export default async function LeaguePage(
  props: {
    params: Promise<{ league_id: string }>;
  }
) {
  const params = await props.params;
  const league = await prisma.league.findUnique({
    where: {
      league_id: params.league_id,
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
  const seasons = await prisma.season.findMany({});

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

      <PageTitle>{league.name}</PageTitle>

      <div className="mb-4 text-muted-foreground">
        <TextWithIcon text={league.season.length + " Seasons"} icon="sunny" />
      </div>

      <PageSubtitle>Seasons</PageSubtitle>
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
                  text={season.event.length + " Events"}
                  icon="forest"
                />
                <TextWithIcon
                  text={season.competitor.length + " Competitors"}
                  icon="sprint"
                />
                <TextWithIcon
                  text={season.grade.length + " Grades"}
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
