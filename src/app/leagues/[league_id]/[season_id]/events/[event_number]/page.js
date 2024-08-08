import PageTitle from "@/components/page_title";
import PageSubtitle from "@/components/page_subtitle";

export default async function EventPage({
  params: { league_id, season_id, event_number },
}) {
  const oevent = await prisma.event.findUnique({
    where: {
      league_id_season_id_event_number: {
        league_id: league_id,
        season_id: season_id,
        event_number: +event_number,
      },
    },
    include: {
      race: true,
    },
  });

  return (
    <>
      <PageTitle
        title={
          "OY" +
          oevent.event_number +
          " " +
          oevent.race.map((race) => race.map).join(" ")
        }
      />
      {/* <PageSubtitle subtitle="Grades" />
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
      ))} */}
    </>
  );
}
