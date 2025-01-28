import Link from "next/link";
import React from "react";
export default function ListRow({
  header,
  summary,
  href,
  more,
  more_href,
}: {
  header: React.ReactNode;
  summary: React.ReactNode;
  href: string;
  more?: React.ReactNode;
  more_href?: string;
}) {
  return (
    <div
      className="
      first:border-t border-b p-4 w-full odd:bg-white even:bg-gray-50 hover:bg-gray-100 mx-auto even:*bg-gray-50"
    >
      <div className="flex flex-row items-center gap-2 sm:gap-10 justify-between">
        <Link href={href} className="flex flex-row flex-1 min-w-0">
          <div className="flex flex-row items-center gap-4 min-w-0">
            <div className="text-md sm:text-xl font-bold truncate">
              {header}
            </div>
            <div className="hidden md:flex flex-col sm:flex-row sm:gap-4 *:text-muted-foreground">
              {summary}
            </div>
          </div>
        </Link>
        {more && more_href && (
          <Link href={more_href} className="shrink-0">
            <div>{more}</div>
          </Link>
        )}
        <Link href={href} className="shrink-0">
          <span className="material-symbols-rounded">arrow_forward_ios</span>
        </Link>
      </div>
    </div>
  );
}
