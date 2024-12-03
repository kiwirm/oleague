export const disciplines = {
  FOR: { icon: "forest", tooltip: "Forest Event" },
  SPR: { icon: "location_city", tooltip: "Sprint Event" },
  MTB: { icon: "directions_bike", tooltip: "Mountain Bike Event" },
  NGT: { icon: "partly_cloudy_night", tooltip: "Night Event" },
  SCO: { icon: "workspaces", tooltip: "Score Event" },
};

export const statusGrades = {
  RUNNING: { icon: "sprint", tooltip: "In Grade" },
  RUNNING_UP: { icon: "arrow_upward", tooltip: "Running Up A Grade" },
  RUNNING_DOWN: { icon: "arrow_downward", tooltip: "Running Down A Grade" },
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
  NA: { icon: "close", tooltip: "DNF or Mispunch", color: "bg-inherit" },
  DNF: { icon: "close", tooltip: "Did Not Finish", color: "bg-inherit" },
  DNS: { icon: "close", tooltip: "Did Not Start", color: "bg-inherit" },
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
