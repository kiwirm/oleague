import prisma from "@/lib/prisma";
import Image, { StaticImageData } from "next/image";

import ListItem from "@/components/list_item";
import Navbar from "@/components/navbar";
import PageTitle from "@/components/page_title";
import TextWithIcon from "@/components/text_with_icon";
import { Button } from "@/components/ui/button";
import NOCLogo from "@/public/noc.jpg";
import ONZLogo from "@/public/onz.png";
import PAPOLogo from "@/public/papo.png";

const logos: { [key: string]: StaticImageData } = {
  "noc.png": NOCLogo,
  "papo.png": PAPOLogo,
  "onz.png": ONZLogo,
};
const leagues = await prisma.league.findMany({
  include: {
    season: {
      orderBy: {
        season_id: "desc",
      },
    },
  },
});

export default async function LeaguesPage({ showNavbar = true }) {
  return (
    <div className="object-fill">
      {showNavbar && (
        <Navbar breadcrumbLinks={[{ label: "Leagues", href: "/leagues" }]} />
      )}
      <PageTitle>Leagues</PageTitle>
      {leagues.map((league) => (
        <ListItem
          key={league.league_id}
          href={`/leagues/${league.league_id}`}
          header={
            league.image &&
            league.name && (
              <>
                <Image
                  src={logos[league!.image]}
                  width={48}
                  alt={league.name}
                  className="inline pr-5"
                />
                {league.name}
              </>
            )
          }
          summary={
            <TextWithIcon
              text={league.season.length + " seasons"}
              icon="sunny"
            />
          }
          more={
            league.season[0] && (
              <Button variant="outline" className="hidden sm:block">
                {"Jump to " + league.season[0].season_id + " season"}
              </Button>
            )
          }
          more_href={
            league.season[0]
              ? `/leagues/${league.league_id}/${league.season[0].season_id}`
              : ""
          }
        />
      ))}
    </div>
  );
}
