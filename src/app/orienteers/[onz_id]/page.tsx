import ListItem from "@/components/list_item";
import Navbar from "@/components/navbar";
import PageSubtitle from "@/components/page_subtitle";
import PageTitle from "@/components/page_title";
import TextWithIcon from "@/components/text_with_icon";
import { notFound } from "next/navigation";
import ordinal from "ordinal";
import prisma from "../../../lib/prisma";

export default async function OrienteerPage({
  params,
}: {
  params: { onz_id: string };
}) {
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

  return (
    <div>
      <Navbar
        breadcrumbLinks={[
          { label: "Orienteers", href: "/orienteers" },
          { label: orienteer.name, href: `/orienteers/${params.onz_id}` },
        ]}
      />
      <PageTitle>
        <div className="flex items-center">
          <span className="material-symbols-rounded bg-muted text-muted-foreground p-4 sm:p-6 text-3rxl sm:text-6xl rounded-full">
            account_circle
          </span>
          <span className="ml-6">{orienteer.full_name}</span>
          <span className="ml-4 text-3xl text-muted-foreground">
            #{orienteer.onz_id}
          </span>
        </div>
      </PageTitle>
      <div>Orienteer from {orienteer.member[0].club.name_short}</div>
      <PageSubtitle>Current leagues</PageSubtitle>
      {competitors
        .filter((competitor) => competitor.season!.provisional)
        .map((competitor) => (
          <ListItem
            header={competitor.season!.league.name}
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
      <PageSubtitle>Results</PageSubtitle>
      {competitors
        .filter((competitor) => competitor.season!.provisional)
        .map((competitor) => (
          <ListItem
            header={
              competitor.season!.season_id +
              " " +
              competitor.season!.league.name
            }
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
}
