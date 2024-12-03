import Navbar from "../components/navbar";
import LeaguesPage from "./leagues/page";
import OrienteerSearchPage from "./orienteers/page";

export default async function Home() {
  return (
    <main>
      <Navbar breadcrumbLinks={[{ href: "/", text: "oleagues.nz" }]} />
      <LeaguesPage showNavbar={false} />
      <OrienteerSearchPage showNavbar={false} />
    </main>
  );
}
