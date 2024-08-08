import prisma from "@/lib/prisma";
import Image from "next/image";

import PAPOLogo from "@/public/papo.png";
import ONZLogo from "@/public/onz.png";
import NOCLogo from "@/public/noc.jpg";
import PageTitle from "@/components/page_title";
import Card from "@/components/card";
import TextWithIcon from "@/components/text_with_icon";

const logos = { "noc.png": NOCLogo, "papo.png": PAPOLogo, "onz.png": ONZLogo };

export default async function LeaguesPage() {
  const leagues = await prisma.league.findMany({
    include: {
      season: {
        orderBy: {
          season_id: "desc",
        },
      },
    },
  });

  return (
    <div className="object-fill">
      <PageTitle title="Leagues" />
      {leagues.map((league) => (
        <Card
          key={league.league_id}
          href={`/leagues/${league.league_id}`}
          header={
            <>
              <Image
                src={logos[league.image]}
                width={60}
                alt={league.name}
                className="inline pr-5"
              />
              {league.name}
            </>
          }
          summary={
            <TextWithIcon
              text={league.season.length + " seasons"}
              icon="sunny"
            />
          }
          more={
            league.season[0] && (
              <TextWithIcon
                className="first:border-t border-b"
                icon="arrow_forward_ios"
                text={"Jump to " + league.season[0].season_id + " season"}
                right
              />
            )
          }
          more_href={
            league.season
              ? `/leagues/${league.league_id}/${league.season.season_id}`
              : ""
          }
        />
      ))}
    </div>
  );
}
