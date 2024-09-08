import prisma from "@/lib/prisma";
import Image, { StaticImageData } from "next/image";

import ListItem from "@/components/list_item";
import PageTitle from "@/components/page_title";
import TextWithIcon from "@/components/text_with_icon";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
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

export default async function LeaguesPage({ showBreadcrumbs = true }) {
  return (
    <div className="object-fill">
      {showBreadcrumbs && (
        <Breadcrumbs
          links={[
            { href: "/", text: "oleagues.nz" },
            { href: "/leagues", text: "Leagues" },
          ]}
        />
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
                  width={60}
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
              <TextWithIcon
                // className="first:border-t border-b"
                icon="arrow_forward_ios"
                text={"Jump to " + league.season[0].season_id + " season"}
              />
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
