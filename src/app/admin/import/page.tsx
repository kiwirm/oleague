import Title from "@/components/page_title";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import prisma from "@/lib/prisma";
import ImportForm from "./form";

export default async function ImportPage() {
  const seasons = await prisma.season.findMany({
    include: {
      league: true,
    },
  });

  return (
    <>
      <Breadcrumbs
        links={[
          { href: "/", text: "oleagues.nz" },
          { href: "/admin/import", text: "Import Results (Admin)" },
        ]}
      />
      <Title>Import Results</Title>
      <ImportForm seasons={seasons} />
    </>
  );
}
