import TextWithIcon from "@/components/text_with_icon";
import Link from "next/link";

const iconMap = {
  PEND: { icon: "pending", style: "italic", name: "Pending" },
  QUAL: { icon: "check_circle", style: "text-black", name: "Qualified" },
  INEL: {
    icon: "cancel",
    style: "text-muted-foreground font-normal italic",
    name: "Ineligible",
  },
};

export default async function RowHeader(competitor) {
  return (
    <>
      <th
        className={`border-t text-2xl sm:text-4xl text-center font-title ${
          iconMap[competitor.eligibility_id].style
        }}`}
      >
        {competitor.eligibility_id !== "INEL"
          ? `${competitor.placing}`
          : `(${competitor.placing})`}
      </th>
      <th
        className={`sticky left-0 truncate max-w-32 lg:max-w-none lg:text-nowrap px-3 bg-inherit min-w-32 h-20 border-t border-r z-10 text-sm sm:text-base font-title text-left ${
          iconMap[competitor.eligibility_id].style
        }`}
      >
        <Link
          href={`/orienteers/${competitor.onz_id}`}
        >{`${competitor.orienteer.first_name} ${competitor.orienteer.last_name}`}</Link>
        <div className="font-medium">
          <TextWithIcon
            text={iconMap[competitor.eligibility_id].name}
            icon={iconMap[competitor.eligibility_id].icon}
          />
        </div>
      </th>
    </>
  );
}
