import React from "react";

export default function RowTotals(competitor) {
  return (
    <th
      className={
        "text-2xl border-t sm:text-4xl text-right px-3 " +
        (competitor.eligibility_id !== "INEL"
          ? "font-bold"
          : "font-normal italic text-gray-400")
      }
    >
      {+competitor.total_points}
    </th>
  );
}
