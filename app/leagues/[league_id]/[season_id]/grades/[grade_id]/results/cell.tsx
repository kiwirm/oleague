import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip";

import { statusGrades, statusResults } from "@/lib/enums";
import { points, result_status_result_id } from "@prisma/client";

const Cell = ({ eligible, points }: { eligible: boolean; points: points }) => {
  return (
    <td
      key={points.event_number}
      className={
        "border-r border-t px-3 py-2 align-text-top " +
        (points.counts_towards_total && eligible
          ? //TODO: status_grade should be an enum in Prisma
            points.status_result &&
            statusResults[points.status_result as result_status_result_id].color
          : " text-muted-foreground italic")
      }
    >
      <div className="text-2xl font-bold font-title">
        {points.points ? +points.points : "\u00A0"}
      </div>
      <div className="text-right">
        {points.status_grade && points.status_grade != "RUNNING" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="material-symbols-rounded">
                  {
                    statusGrades[
                      points.status_grade as keyof typeof statusGrades
                    ].icon
                  }
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {
                  statusGrades[points.status_grade as keyof typeof statusGrades]
                    .tooltip
                }
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {points.status_result &&
          !["PLAN", "CTRL"].includes(points.status_result) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="material-symbols-rounded">
                    {
                      statusResults[
                        points.status_result as result_status_result_id
                      ].icon
                    }
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {
                    statusResults[
                      points.status_result as result_status_result_id
                    ].tooltip
                  }
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
      </div>
    </td>
  );
};
export default Cell;
