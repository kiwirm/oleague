import { competitor } from "@prisma/client";

export default function RowTotals(competitor: competitor) {
  return (
    <th
      className={
        "text-2xl border-t sm:text-4xl text-right px-3 " +
        (competitor.eligibility_id !== "INEL"
          ? "font-bold"
          : "font-normal italic text-muted-foreground")
      }
    >
      {competitor.total_points ? +competitor.total_points : "-"}
    </th>
  );
}
