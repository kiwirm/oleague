import OrienteerSearch from "./search";

import { Alert, AlertDescription, AlertTitle } from "@/components/alert";
import Navbar from "@/components/navbar";
import Title from "@/components/title";

import prisma from "@/lib/prisma";

const OrienteerSearchPage = async ({ showNavbar = true }) => {
  const orienteers = await prisma.orienteer.findMany({
    where: {
      member: {
        every: {
          club_id: {
            equals: "PP",
          },
        },
      },
    },
  });

  return (
    <>
      {showNavbar && (
        <Navbar
          breadcrumbLinks={[{ text: "Orienteers", href: "/orienteers" }]}
        />
      )}
      <Title>Orienteers</Title>
      <div>
        <OrienteerSearch orienteers={orienteers} />
        <Alert variant="warning" className="mt-4">
          <AlertTitle>
            <span className="material-symbols-rounded align-text-bottom pr-1">
              Warning
            </span>
            Not fully implemented
          </AlertTitle>
          <AlertDescription>
            Search implemented for PAPO orienteers only
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
};

export default OrienteerSearchPage;
