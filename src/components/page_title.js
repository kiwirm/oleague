import Link from "next/link";
import TextWithIcon from "./text_with_icon";

export default function PageTitle({
  title,
  subtitle,
  underline,
  subtitle_href,
}) {
  return (
    <div className="mt-8 mb-12">
      <h1
        className={`mb-2 text-3xl sm:text-6xl font-bold ${
          underline && "underline"
        }`}
      >
        {title}
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
