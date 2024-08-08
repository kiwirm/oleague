import prisma from "@/lib/prisma";
import PageTitle from "@/components/page_title";
import PageSubtitle from "@/components/page_subtitle";
import Card from "@/components/card";
import TextWithIcon from "@/components/text_with_icon";

const medalColours = {
  0: "text-yellow-500",
  1: "text-gray-500",
  2: "text-orange-800",
};

const iconMap = {
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

export default async function LeagueSeasonPage({
  params: { league_id, season_id },
}) {
  const season = await prisma.season.findUnique({
    where: {
      league_id_season_id: {
        league_id: league_id,
        season_id: season_id,
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

  return (
    <>
      <PageTitle
        title={
          <div className="flex flex-row items-end">
            <span>{season.season_id + " Season"}</span>
            <span className="inline ml-4 mb-1 px-2 py-1 bg-blue-500 rounded-lg text-white sm:text-lg tracking-wide uppercase font-bold">
              {season.provisional ? "provisional" : "final"}
            </span>
          </div>
        }
        subtitle={season.league.name}
        subtitle_href={`/leagues/${league_id}`}
      />

      <div className="mb-4 text-gray-500">
        <TextWithIcon text={season.event.length + " Events"} icon="forest" />
        <TextWithIcon
          text={season.competitor.length + " Competitors"}
          icon="sprint"
        />
        <TextWithIcon
          text={season.grade.length + " Grades"}
          icon="receipt_long"
        />
      </div>
      <PageSubtitle subtitle="Events" />
      {season.event.map((oevent) => (
        <Card
          key={oevent.event_number}
          href={`/leagues/${league_id}/${season_id}/events/${oevent.event_number}`}
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

      <PageSubtitle subtitle="Grades" />
      {season.grade.map((grade) => (
        <Card
          key={grade.grade_id}
          href={`/leagues/${league_id}/${season_id}/grades/${grade.grade_id}`}
          header={grade.name}
          summary={
            grade.competitor.length ? (
              <TextWithIcon
                text={
                  grade.competitor[0].orienteer.first_name +
                  " " +
                  grade.competitor[0].orienteer.last_name
                }
                icon="trophy"
              />
            ) : undefined
          }
        />
        // <table>
        //   <thead className="font-bold text-lg">
        //     <th className="w-60 text-left">Competitor</th>
        //     <th>Points</th>
        //     <th className="w-16 text-right"></th>
        //   </thead>
        //   <tbody>
        //     {grade.competitor.splice(0, 3).map((competitor, index) => (
        //       <tr className="border-t text-gray-500">
        //         <Link
        //           href={`/orienteers/${competitor.orienteer.onz_id}`}
        //         >
        //           <td className="pt-4 pb-4 ">
        //             <span className="material-symbols-rounded">
        //               person
        //             </span>
        //             {competitor.orienteer.first_name +
        //               " " +
        //               competitor.orienteer.last_name}
        //           </td>
        //         </Link>
        //         <td className="font-bold">
        //           {+competitor.total_points}
        //         </td>
        //         <td
        //           className={`pl-4 material-symbols-rounded ${medalColours[index]}`}
        //         >
        //           social_leaderboard
        //         </td>
        //       </tr>
        //     ))}
        //   </tbody>
        // </table>
        // </div>
      ))}
    </>
  );
}
