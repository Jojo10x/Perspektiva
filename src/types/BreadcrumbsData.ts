interface Crumb {
  name: string;
  path?: string;
}

interface BreadcrumbsData {
  [key: string]: Crumb[];
}

export const breadcrumbsData: BreadcrumbsData = {
  "/Home": [{ name: "Home" }],
  "/History": [{ name: "Home", path: "/Home" }, { name: "Plans", path: "/Plans" }, { name: "History" }],
  "/Habits": [{ name: "Home", path: "/Home" }, { name: "Habits" }],
  "/Plans": [{ name: "Home", path: "/Home" }, { name: "Plans" }],
  "/Goals": [{ name: "Home", path: "/Home" }, { name: "Goals" }],
  "/Settings": [{ name: "Home", path: "/Home" }, { name: "Settings" }],
  "/HabitList": [{ name: "Home", path: "/Home" },{ name: "Habits", path: "/Habits" }, { name: "Habitlist", path: "/HabitList" }]
};