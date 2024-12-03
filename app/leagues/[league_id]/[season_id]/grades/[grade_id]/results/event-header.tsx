import TextWithIcon from "@/components/text-with-icon";

import { disciplines } from "@/lib/enums";
import { eventWithRaces } from "@/lib/prisma";

import { Prisma, race_discipline } from "@prisma/client";

import Link from "next/link";

const EventHeader = ({
  event,
}: {
  event: Prisma.eventGetPayload<typeof eventWithRaces>;
}) => (
  <th className="min-w-20 align-bottom pb-4">
    <div className="-rotate-45 pl-3 absolute origin-top-left">
      <div className="flex flex-row h-6">
        <Link
          href={`/leagues/${event.league_id}/${event.season_id}/events/${event.event_number}`}
        >
          <TextWithIcon
            text={"OY " + event.event_number}
            //TODO: this should be automatically typed correctly
            icon={disciplines[event.race[0].discipline as race_discipline].icon}
          />
        </Link>
        <span className="ml-2 font-normal">
          {event.event_date.toLocaleDateString()}
        </span>
      </div>
      <div className="w-32 truncate text-left ml-5">
        {event.race.map((race) => race.map).join(", ")}
      </div>
    </div>
    <div className="text-xs"></div>
  </th>
);

export default EventHeader;
