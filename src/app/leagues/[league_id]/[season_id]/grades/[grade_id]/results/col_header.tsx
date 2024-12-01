import TextWithIcon from "@/components/text_with_icon";
import { event } from "@prisma/client";
import { iconMap } from "../../../page";

export default function ColHeader({ event }: { event: event }) {
  return (
    <th className="text-center w-28">
      <div className="-rotate-45 pl-3 absolute origin-top-left overflow-ellipsis">
        <div className="flex flex-row h-6">
          <TextWithIcon
            text={"OY " + event.event_number}
            icon={iconMap[event.race[0].discipline]}
          />
          <span className="ml-2 font-normal">
            {event.event_date.toLocaleDateString()}
          </span>
        </div>
        <div className="w-40 h-5 text-left ml-5 overflow-ellipsis">
          {event.race[0].map}
        </div>
      </div>
      <div className="text-xs"></div>
    </th>
  );
}
