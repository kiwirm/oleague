import Navbar from "@/components/navbar";
import LeaguesPage from "./leagues/page";
import OrienteersPage from "./orienteers/page";

export default async function Home() {
  return (
    <>
      <main>
        <Navbar breadcrumbLinks={[{ href: "/", text: "oleagues.nz" }]} />
        <LeaguesPage showNavbar={false} />
        <OrienteersPage showNavbar={false} />
      </main>
    </>
  );
}
