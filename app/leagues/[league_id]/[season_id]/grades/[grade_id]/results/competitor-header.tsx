import TextWithIcon from "@/components/text-with-icon";

import { eligibility } from "@/lib/enums";
import { competitorExtended } from "@/lib/prisma";

import { Prisma } from "@prisma/client";

import Link from "next/link";

const CompetitorHeader = async ({
  competitor,
}: {
  competitor: Prisma.competitorGetPayload<typeof competitorExtended>;
}) => (
  <>
    <th
      className={`border-t text-2xl sm:text-4xl text-center font-title ${
        eligibility[competitor.eligibility_id as keyof typeof eligibility].style
      }}`}
    >
      {competitor.eligibility_id !== "INEL"
        ? `${competitor.placing}`
        : `(${competitor.placing})`}
    </th>
    <th
      className={`sticky left-0 truncate max-w-32 lg:max-w-none lg:text-nowrap px-3 bg-inherit min-w-32 h-20 border-t border-r z-10 text-sm sm:text-base font-title text-left ${
        eligibility[competitor.eligibility_id as keyof typeof eligibility].style
      }`}
    >
      <Link
        href={`/orienteers/${competitor.onz_id}`}
      >{`${competitor.orienteer.first_name} ${competitor.orienteer.last_name}`}</Link>
      <div className="font-medium">
        <TextWithIcon
          text={
            eligibility[competitor.eligibility_id as keyof typeof eligibility]
              .name
          }
          icon={
            eligibility[competitor.eligibility_id as keyof typeof eligibility]
              .icon
          }
        />
      </div>
    </th>
  </>
);

export default CompetitorHeader;
