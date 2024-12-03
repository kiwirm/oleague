import { Breadcrumbs } from "@/components/breadcrumb";

import GithubMark from "@/public/images/github-mark.png";

import Image from "next/image";
import Link from "next/link";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const MobileMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <span className="material-symbols-rounded">menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <Link href="/admin/import">Admin</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/about">About</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <a
          href="https://github.com/ryan-mooore/oleague"
          className="w-full flex items-center gap-2"
        >
          GitHub
          <Image src={GithubMark} alt="Github Mark" width={16} height={16} />
        </a>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const DesktopMenu = () => (
  <ul className="hidden md:flex flex-row justify-end items-center gap-5">
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
);

const Navbar = ({
  breadcrumbLinks,
}: {
  breadcrumbLinks: { href: string; text: string }[];
}) => {
  return (
    <nav className="flex flex-row justify-between items-center p-4">
      <Breadcrumbs links={breadcrumbLinks} />
      <div className="sm:hidden ml-8">
        <MobileMenu />
      </div>
      <div className="hidden sm:block ml-8">
        <DesktopMenu />
      </div>
    </nav>
  );
};

export default Navbar;
