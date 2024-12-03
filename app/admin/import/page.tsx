import Navbar from "@/components/navbar";
import Title from "@/components/title";

import prisma from "@/lib/prisma";

import ResultsForm from "./form";

export default async function ImportPage() {
  const seasons = await prisma.season.findMany({
    include: {
      league: true,
    },
  });

  return (
    <>
      <Navbar
        breadcrumbLinks={[
          { text: "Admin", href: "/admin" },
          { text: "Import", href: "/admin/import" },
        ]}
      />
      <Title>Import Results</Title>
      <ResultsForm seasons={seasons} />
    </>
  );
}
