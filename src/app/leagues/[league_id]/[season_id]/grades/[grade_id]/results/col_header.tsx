import TextWithIcon from "@/components/text_with_icon";
import { event } from "@prisma/client";
import { iconMap } from "../../../page";

export default function ColHeader({ event }: { event: event }) {
  return (
    <th className="min-w-20 align-bottom pb-4">
      <div className="-rotate-45 pl-3 absolute origin-top-left">
        <div className="flex flex-row h-6">
          <TextWithIcon
            text={"OY " + event.event_number}
            icon={iconMap[event.race[0].discipline]}
          />
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
}
