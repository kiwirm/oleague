import PageTitle from "@/components/page_title";
import OrienteerSearch from "./search";

import Navbar from "@/components/navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import prisma from "@/lib/prisma";

export default async function OrienteersPage({ showNavbar = true }) {
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
          breadcrumbLinks={[{ label: "Orienteers", href: "/orienteers" }]}
        />
      )}
      <PageTitle>Orienteers</PageTitle>
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
}
