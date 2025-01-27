import OrienteerSearch from "./search";

import Navbar from "@/components/navbar";
import Title from "@/components/title";

import prisma from "@/lib/prisma";

const OrienteerSearchPage = async ({ showNavbar = true }) => {
  const orienteers = await prisma.orienteer.findMany({
    where: {
      NOT: {
        result: {
          none: {},
        },
      },
    },
  });
  await prisma.$disconnect();

  return (
    <>
      {showNavbar && (
        <Navbar
          breadcrumbLinks={[
            { text: "oleagues.nz", href: "/" },
            { text: "Orienteers", href: "/orienteers" },
          ]}
        />
      )}
      <Title>Orienteers</Title>
      <div>
        <OrienteerSearch orienteers={orienteers} />
      </div>
    </>
  );
};

export default OrienteerSearchPage;
