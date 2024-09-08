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
        className={`border-t px-3 text-2xl sm:text-4xl text-right font-title ${
          iconMap[competitor.eligibility_id].style
        }}`}
      >
        {competitor.eligibility_id !== "INEL"
          ? `${competitor.placing}`
          : `(${competitor.placing})`}
      </th>
      <th
        className={`w-96 border-t border-r px-3 text-sm sm:text-base font-title text-left ${
          iconMap[competitor.eligibility_id].style
        }`}
      >
        <Link
          href={`/orienteers/${competitor.onz_id}`}
        >{`${competitor.orienteer.first_name} ${competitor.orienteer.last_name}`}</Link>
        <span className="font-medium">
          <TextWithIcon
            text={iconMap[competitor.eligibility_id].name}
            icon={iconMap[competitor.eligibility_id].icon}
          />
        </span>
      </th>
    </>
  );
}
