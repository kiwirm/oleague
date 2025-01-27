export const disciplines = {
  FOR: { icon: "forest", tooltip: "Forest event" },
  SPR: { icon: "location_city", tooltip: "Sprint event" },
  MTB: { icon: "directions_bike", tooltip: "Mountain bike event" },
  NGT: { icon: "partly_cloudy_night", tooltip: "Night event" },
  SCO: { icon: "workspaces", tooltip: "Score event" },
};

export const statusGrades = {
  RUNNING: { icon: "sprint", tooltip: "In Grade" },
  RUNNING_UP: { icon: "arrow_upward", tooltip: "Running up a grade" },
  RUNNING_DOWN: { icon: "arrow_downward", tooltip: "Running down a grade" },
  ORGANISING: { icon: "construction", tooltip: "Organiser" },
  RUNNING_OTHER: {
    icon: "question_mark",
    tooltip: "Running in Wrong Grade",
  },
};

export const statusResults = {
  WIN: { icon: "trophy", tooltip: "Winner", color: "bg-green-100" },
  PLAN: { icon: "edit", tooltip: "Planner", color: "bg-yellow-100" },
  CTRL: { icon: "inventory", tooltip: "Controller", color: "bg-yellow-100" },
  OK: { icon: "check", tooltip: "OK", color: "bg-inherit" },
  MP: { icon: "mp", tooltip: "Mispunch", color: "bg-inherit" },
  NA: { icon: "rule", tooltip: "Some races missed", color: "bg-inherit" },
  DNF: { icon: "close", tooltip: "Did not finish", color: "bg-inherit" },
  DNS: { icon: "close", tooltip: "Did not start", color: "bg-inherit" },
  NW: { icon: "error", tooltip: "No eligible winner", color: "bg-inherit" },
  DQ: { icon: "block", tooltip: "Disqualified", color: "bg-inherit" },
};

export const eligibility = {
  PEND: { icon: "pending", style: "italic", name: "Pending" },
  QUAL: { icon: "check_circle", style: "text-black", name: "Qualified" },
  INEL: {
    icon: "cancel",
    style: "text-muted-foreground font-normal italic",
    name: "Ineligible",
  },
};
