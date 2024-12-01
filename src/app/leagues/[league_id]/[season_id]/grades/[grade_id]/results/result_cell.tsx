const derivationColors = {
  WIN: "bg-green-100",
  PLAN: "bg-yellow-100",
  CTRL: "bg-yellow-100",
};

const statusGradeMap = {
  RUNNING: "sprint",
  RUNNING_UP: "arrow_upward",
  RUNNING_DOWN: "arrow_downward",
  ORGANISING: "construction",
  RUNNING_OTHER: "question_mark",
};

const statusResultMap = {
  WIN: "trophy",
  PLAN: "edit",
  CTRL: "inventory",
  OK: "check",
  MP: "mp",
  DNF: "close",
};

export default function ResultCell(competitor, points) {
  return (
    <td
      key={points.event_number}
      className={
        "border-r border-t p-3 " +
        (points.counts_towards_total && competitor.eligibility_id !== "INEL"
          ? derivationColors[points.status_result]
          : "text-muted-foreground italic")
      }
    >
      <div className="text-2xl font-bold font-title">
        {points.points ? +points.points : ""}
      </div>
      <span className="material-symbols-rounded">
        {statusGradeMap[points.status_grade]}
      </span>
      <span className="material-symbols-rounded">
        {statusResultMap[points.status_result]}
      </span>
    </td>
  );
}
