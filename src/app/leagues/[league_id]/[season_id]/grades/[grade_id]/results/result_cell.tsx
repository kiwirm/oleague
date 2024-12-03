import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const derivationColors = {
  WIN: "bg-green-100",
  PLAN: "bg-yellow-100",
  CTRL: "bg-yellow-100",
};

const statusGradeMap = {
  RUNNING: { icon: "sprint", description: "In Grade" },
  RUNNING_UP: { icon: "arrow_upward", description: "Running Up A Grade" },
  RUNNING_DOWN: { icon: "arrow_downward", description: "Running Down A Grade" },
  ORGANISING: { icon: "construction", description: "Organiser" },
  RUNNING_OTHER: { icon: "question_mark", description: "?" },
};

const statusResultMap = {
  WIN: { icon: "trophy", description: "Winner" },
  PLAN: { icon: "edit", description: "Planner" },
  CTRL: { icon: "inventory", description: "Controller" },
  OK: { icon: "check", description: "OK" },
  MP: { icon: "mp", description: "Mispunch" },
  NA: { icon: "close", description: "DNF or Mispunch" },
  DNF: { icon: "close", description: "Did Not Finish" },
  DNS: { icon: "close", description: "Did Not Start" },
};

export default function ResultCell(competitor, points) {
  return (
    <td
      key={points.event_number}
      className={
        "border-r border-t px-3 py-2 align-text-top " +
        (points.counts_towards_total && competitor.eligibility_id !== "INEL"
          ? derivationColors[points.status_result]
          : "text-muted-foreground italic")
      }
    >
      <div className="text-2xl font-bold font-title">
        {points.points ? +points.points : ""}
      </div>
      <div className="text-right">
        {points.status_grade != "RUNNING" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="material-symbols-rounded">
                  {statusGradeMap[points.status_grade]?.icon}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {statusGradeMap[points.status_grade]?.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {!["PLAN", "CTRL"].includes(points.status_result) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="material-symbols-rounded">
                  {statusResultMap[points.status_result]?.icon}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {statusResultMap[points.status_result]?.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </td>
  );
}
