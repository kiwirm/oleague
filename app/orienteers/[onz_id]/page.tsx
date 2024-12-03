import ListItem from "@/components/list-row";
import Navbar from "@/components/navbar";
import Subtitle from "@/components/subtitle";
import TextWithIcon from "@/components/text-with-icon";
import Title from "@/components/title";

import prisma from "@/lib/prisma";

import { notFound } from "next/navigation";

import ordinal from "ordinal";

const OrienteerPage = async (props: {
  params: Promise<{ onz_id: string }>;
}) => {
  const params = await props.params;
  const orienteer = await prisma.orienteer.findUnique({
    where: {
      onz_id: +params.onz_id,
    },
    include: {
      member: {
        include: {
          club: true,
        },
      },
    },
  });

  if (orienteer === null) {
    return notFound();
  }

  const competitors = await prisma.competitor.findMany({
    where: {
      onz_id: orienteer?.onz_id,
    },
    include: {
      season: {
        include: {
          league: true,
        },
      },
      grade: true,
    },
  });
  await prisma.$disconnect();

  return (
    <div>
      <Navbar
        breadcrumbLinks={[
          { href: "/", text: "oleagues.nz" },
          { text: "Orienteers", href: "/orienteers" },
          {
            text: orienteer.full_name || `Orienteer #${orienteer.onz_id}`,
            href: `/orienteers/${params.onz_id}`,
          },
        ]}
      />
      <Title>
        <div className="flex items-center">
          <span className="material-symbols-rounded bg-muted text-muted-foreground p-4 sm:p-6 text-3rxl sm:text-6xl rounded-full">
            account_circle
          </span>
          <span className="ml-6">{orienteer.full_name}</span>
          <span className="ml-4 text-3xl text-muted-foreground">
            #{orienteer.onz_id}
          </span>
        </div>
      </Title>
      <div>Orienteer from {orienteer.member[0].club.name_short}</div>
      <Subtitle>Current leagues</Subtitle>
      {competitors
        .filter((competitor) => competitor.season!.provisional)
        .map((competitor) => (
          <ListItem
            header={competitor.season!.league.name}
            key={competitor.onz_id}
            summary={
              <>
                <TextWithIcon
                  text={competitor.grade!.name}
                  icon="receipt_long"
                />
                <TextWithIcon
                  text={competitor.eligibility_id}
                  // icon={iconMap[competitor.eligibility_id].icon}
                  icon="check_circle"
                />
              </>
            }
            href={`/leagues/${competitor.season!.league_id}/${
              competitor.season!.season_id
            }`}
          />
        ))}
      <Subtitle>Results</Subtitle>
      {competitors
        .filter((competitor) => !competitor.season!.provisional)
        .map((competitor) => (
          <ListItem
            header={
              competitor.season!.season_id +
              " " +
              competitor.season!.league.name
            }
            key={competitor.onz_id}
            summary={
              <>
                <TextWithIcon
                  text={competitor.grade!.name}
                  icon="receipt_long"
                />
                <TextWithIcon
                  text={competitor.eligibility_id}
                  // icon={iconMap[competitor.eligibility_id].icon}
                  icon="check_circle"
                />
                <TextWithIcon
                  text={ordinal(Number(competitor.placing)) + " Place"}
                  icon="trophy"
                />
              </>
            }
            href={`/leagues/${competitor.season!.league_id}/${
              competitor.season!.season_id
            }/grades/${competitor.grade_id}/results`}
          />
        ))}
    </div>
  );
};

export default OrienteerPage;
