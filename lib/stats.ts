import { event as event_prisma, Prisma } from "@prisma/client";

import { GradeIncludeAll } from "./prisma";

export const pointsAfterEvent = (
  grade: Prisma.gradeGetPayload<typeof GradeIncludeAll>,
  oevent: event_prisma
) =>
  Object.fromEntries(
    grade.competitor.map((competitor) => [
      competitor.onz_id,
      +competitor.points
        .filter((points) => points.event_number <= oevent.event_number)
        .reduce((sum, point) => sum + +point.points!, 0),
    ])
  );
