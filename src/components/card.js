import Link from "next/link";
export default function Card({ header, summary, href, more, more_href }) {
  return (
    <div
      className="
      first:border-t border-b p-4 w-full odd:bg-white even:bg-gray-50 hover:bg-gray-100 mx-auto even:*bg-gray-50"
    >
      <div className="flex flex-row items-center gap-10 justify-between">
        <Link href={href} className="flex flex-row flex-1">
          <div className="text-md sm:text-xl font-bold mr-4 flex flex-row items-center gap-4">
            {header}
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4 *:text-gray-400">
            {summary}
          </div>
        </Link>
        {more && (
          <Link href={more_href}>
            <div>{more}</div>
          </Link>
        )}
      </div>
    </div>
  );
}
