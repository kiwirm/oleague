import PageSubtitle from "@/components/page_subtitle";
import prisma from "../../../lib/prisma";
import PageTitle from "@/components/page_title";

export default async function OrienteerPage({ params: { onz_id } }) {
  const orienteer = await prisma.orienteer.findUnique({
    where: {
      onz_id: +onz_id,
    },
    include: {
      member: {
        include: {
          club: true,
        },
      },
    },
  });
  const competitors = await prisma.competitor.findMany({
    where: {
      onz_id: orienteer.onz_id,
    },
  });
  return (
    <div>
      <PageTitle
        title={
          <div>
            <span className="material-symbols-rounded">person</span>
            {orienteer.first_name + " " + orienteer.last_name}
          </div>
        }
      />
      <div>Orienteer from {orienteer.member[0].club.name_short}</div>
      <PageSubtitle subtitle="Leagues" />
      {competitors.map((competitor) => (
        <div key={competitor.onz_id}>
          {competitor.season_id} {competitor.grade_id} {competitor.total_points}
        </div>
      ))}
    </div>
  );
}
