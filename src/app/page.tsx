import { Breadcrumbs } from "@/components/ui/breadcrumb";
import LeaguesPage from "./leagues/page";
import OrienteersPage from "./orienteers/page";

export default async function Home() {
  return (
    <>
      <main>
        <Breadcrumbs links={[{ href: "/", text: "oleagues.nz" }]} />
        <LeaguesPage showBreadcrumbs={false} />
        <OrienteersPage showBreadcrumbs={false} />
      </main>
    </>
  );
}
