import PageTitle from "@/components/page_title";
import prisma from "@/lib/prisma";
import Card from "@/components/card";
import TextWithIcon from "@/components/text_with_icon";
import PageSubtitle from "@/components/page_subtitle";
import ProvisionalBadge from "@/components/provisional_badge";

export async function generateStaticParams() {
  const leagues = await prisma.league.findMany({
    select: {
      league_id: true,
    },
  });

  return leagues.map((league) => ({
    league_id: league.league_id.toString(),
  }));
}

export default async function LeaguePage({ params: { league_id } }) {
  const league = await prisma.league.findUnique({
    where: {
      league_id: league_id,
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
  return (
    <>
      <PageTitle
        title={league.name}
        subtitle={"oleagues.nz"}
        subtitle_href="/"
      />

      <div className="mb-4 text-gray-500">
        <TextWithIcon text={league.season.length + " Seasons"} icon="sunny" />
      </div>

      <PageSubtitle subtitle="Seasons" />
      <div>
        {league.season.map((season) => (
          <Card
            href={`/leagues/${league_id}/${season.season_id}`}
            key={season.season_id}
            header={
              <>
                <ProvisionalBadge provisional={season.provisional} />
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
