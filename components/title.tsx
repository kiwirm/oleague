import Link from "next/link";
import TextWithIcon from "./text-with-icon";

export default function Title({
  children,
  subtitle,
  underline,
  subtitle_href,
}: {
  children: React.ReactNode;
  subtitle?: string;
  underline?: boolean;
  subtitle_href?: string;
}) {
  return (
    <div className="mt-8 mb-3 sm:mb-6">
      <h1
        className={`mb-2 text-3xl sm:text-6xl font-bold ${
          underline && "underline"
        }`}
      >
        {children}
      </h1>
      {subtitle && (
        <Link href={subtitle_href || ""}>
          <h2 className="text-xl sm:text-4xl">
            <TextWithIcon icon="arrow_back_ios" text={subtitle} />
          </h2>
        </Link>
      )}
    </div>
  );
}
