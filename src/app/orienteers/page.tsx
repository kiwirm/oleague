import PageTitle from "@/components/page_title";
import OrienteerSearch from "./search";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import prisma from "@/lib/prisma";
import { AlertTriangle } from "lucide-react";

export default async function OrienteersPage({ showBreadcrumbs = true }) {
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
      {showBreadcrumbs && (
        <Breadcrumbs
          links={[
            { href: "/", text: "oleagues.nz" },
            { href: "./orienteers", text: "Orienteers" },
          ]}
        />
      )}
      <PageTitle>Orienteers</PageTitle>
      <div>
        <OrienteerSearch orienteers={orienteers} />
        <Alert variant="warning" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Not fully implemented</AlertTitle>
          <AlertDescription>
            Search implemented for PAPO orienteers only
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}
