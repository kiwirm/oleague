import TextWithIcon from "@/components/text_with_icon";
import { Prisma } from "@prisma/client";
import React from "react";

const iconMap = {
  FOR: "forest",
  SPR: "location_city",
  MTB: "directions_bike",
  NGT: "partly_cloudy_night",
  SCO: "workspaces",
};

export const eventsWithRaces = Prisma.validator<Prisma.eventDefaultArgs>()({
  include: { race: true },
});

export default function ColHeader(
  oevent: Prisma.eventGetPayload<typeof eventsWithRaces>[]
) {
  return (
    <React.Fragment>
      <th className="w-28">
        <div className="relative left-1/2 -top-5">
          <div className="origin-bottom-left absolute w-56 -rotate-45">
            <TextWithIcon
              text={"OY" + oevent.event_number + " " + oevent.race[0].map}
              // icon={oevent.race.map((race) => iconMap[race.discipline])}
              icon={iconMap[oevent.race[0].discipline]}
            />
          </div>
        </div>
      </th>
    </React.Fragment>
  );
}
