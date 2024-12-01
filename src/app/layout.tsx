import "material-symbols";
import { Noto_Sans } from "next/font/google";

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
//TODO: dark mode

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body className={`${notoSans.variable} m-5 sm:m-10 font-sans mb-24`}>
        <div className="max-w-screen-lg mx-auto">{children}</div>
      </body>
    </html>
  );
}
