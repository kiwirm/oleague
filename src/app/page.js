import Image from "next/image";
import LeaguesPage from "./leagues/page";
import OrienteersPage from "./orienteers/page";
import PageTitle from "@/components/page_title";

export default function Home() {
  return (
    <main>
      <PageTitle title="oleagues.nz" underline />
      <LeaguesPage />
      <PageTitle title="Orienteers" />
      <OrienteersPage />
    </main>
  );
}
