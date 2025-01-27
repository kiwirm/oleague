import prisma from "@/lib/prisma";
import Image, { StaticImageData } from "next/image";

import pluralize from "pluralize";

import { Button } from "@/components/button";
import ListItem from "@/components/list-row";
import Navbar from "@/components/navbar";
import TextWithIcon from "@/components/text-with-icon";
import Title from "@/components/title";

import NOCLogo from "@/public/images/noc.jpg";
import ONZLogo from "@/public/images/onz.png";
import PAPOLogo from "@/public/images/papo.png";

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
await prisma.$disconnect();

const LeaguesPage = async ({ showNavbar = true }) => (
  <div className="object-fill">
    {showNavbar && (
      <Navbar
        breadcrumbLinks={[
          { text: "oleagues.nz", href: "/" },
          { text: "Leagues", href: "/leagues" },
        ]}
      />
    )}
    <Title>Leagues</Title>
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
            text={pluralize("seasons", league.season.length, true)}
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

export default LeaguesPage;
