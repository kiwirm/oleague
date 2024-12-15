import Navbar from "@/components/navbar";
import Title from "@/components/title";

import GithubMark from "@/public/images/github-mark.png";

import Image from "next/image";

const AboutPage = () => (
  <>
    <Navbar
      breadcrumbLinks={[
        { href: "/", text: "oleagues.nz" },
        { text: "About", href: "/about" },
      ]}
    />
    <Title>About oleagues.nz</Title>
    <p className="mb-8">
      oleagues.nz is a website for the New Zealand orienteering community. It
      provides a centralised location for orienteers to view rankings in various
      competitions throughout the year, updated after each event. Created by
      Ryan Moore, &#169; 2024.
    </p>
    <p>
      Technology Stack: Typescript, React, Next.js, shadcn/ui, TailwindCSS,
      Prisma, MySQL, Docker
    </p>
    <p className="mb-8">
      Mixed Static/SSR rendering using Next 15 server actions and App Router
    </p>

    <a
      href="https://github.com/ryan-mooore/oleague"
      className="flex flex-row gap-2 underline"
    >
      <Image src={GithubMark} alt="Github Mark" width={24} /> View on Github
    </a>
  </>
);

export default AboutPage;
