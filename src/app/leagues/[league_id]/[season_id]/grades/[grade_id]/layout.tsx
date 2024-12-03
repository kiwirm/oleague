import Navbar from "@/components/navbar";
import PageTitle from "@/components/page_title";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function GradeLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ league_id: string; season_id: string; grade_id: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const grade = await prisma.grade.findUnique({
    where: {
      league_id_season_id_grade_id: {
        league_id: params.league_id,
        season_id: params.season_id,
        grade_id: params.grade_id,
      },
    },
    include: {
      season: {
        include: {
          league: true,
        },
      },
    },
  });

  if (!grade) {
    return null;
  }

  return (
    <>
      <Navbar
        breadcrumbLinks={[
          { href: "/", text: "oleagues.nz" },
          { href: "/leagues", text: "Leagues" },
          {
            href: `/leagues/${grade.season.league.league_id}`,
            text: grade.season.league.name!,
          },
          {
            href: `/leagues/${grade.season.league.league_id}/${grade.season.season_id}`,
            text: grade.season.season_id + " Season",
          },
          {
            href: `/leagues/${grade.season.league.league_id}/${grade.season.season_id}/${grade.grade_id}`,
            text: grade.name,
          },
        ]}
      />
      <PageTitle>{grade.name}</PageTitle>
      <nav className="mb-4">
        <ul className="flex space-x-4">
          <li className="text-gray-500">
            <Link
              href={`/leagues/${params.league_id}/${params.season_id}/grades/${params.grade_id}/results`}
            >
              Results
            </Link>
          </li>
          <li className="text-gray-500">
            <Link
              href={`/leagues/${params.league_id}/${params.season_id}/grades/${params.grade_id}/stats`}
            >
              Stats
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </>
  );
}
