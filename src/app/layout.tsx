import "material-symbols";
import { Noto_Sans } from "next/font/google";

import GithubMark from "@/public/github-mark.png";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const metadata = {
  title: "oleagues.nz | NZ Orienteering Competitor Rankings",
  description: "Rankings for NZ competitive orienteers",
};

//TODO: better metadata
//TODO: correct types for table RFCs
//TODO: switch to other icons
//TODO: graphs
//TODO: dark mode
//TODO: better mobile layout

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${notoSans.variable} p-5 sm:p-10 font-sans flex flex-row justify-center mb-24`}
      >
        <div className="w-full max-w-screen-lg relative">
          <nav className="absolute right-0">
            <ul className="flex flex-row justify-end items-center gap-5">
              <Link
                href="/admin/import"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <a href="https://github.com/ryan-mooore/oleague">
                <Image src={GithubMark} alt="Github Mark" width={24} />
              </a>
            </ul>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
