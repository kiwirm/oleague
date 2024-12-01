import Navbar from "@/components/navbar";
import Title from "@/components/page_title";
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
      <Navbar
        breadcrumbLinks={[
          { label: "Admin", href: "/admin" },
          { label: "Import", href: "/admin/import" },
        ]}
      />
      <Title>Import Results</Title>
      <ImportForm seasons={seasons} />
    </>
  );
}
