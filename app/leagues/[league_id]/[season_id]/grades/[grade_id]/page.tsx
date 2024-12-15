import { redirect } from "next/navigation";

export default async function GradePage(props: {
  params: Promise<{ league_id: string; season_id: string; grade_id: string }>;
}) {
  const params = await props.params;
  redirect(
    `/leagues/${params.league_id}/${params.season_id}/grades/${params.grade_id}/results`
  );
}
