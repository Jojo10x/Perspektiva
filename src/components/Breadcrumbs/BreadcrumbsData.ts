interface Crumb {
  name: string;
  path?: string;
}

interface BreadcrumbsData {
  [key: string]: Crumb[];
}

export const breadcrumbsData: BreadcrumbsData = {
  "/": [{ name: "Home" }],
  "/History": [{ name: "Home", path: "/" }, { name: "Plans", path: "/Plans" }, { name: "History" }],
  "/Habit": [{ name: "Home", path: "/" }, { name: "Habit" }],
  "/Plans": [{ name: "Home", path: "/" }, { name: "Plans" }],
  "/Settings": [{ name: "Home", path: "/" }, { name: "Settings" }],
  "/HabitList": [{ name: "Home", path: "/" },{ name: "Habit", path: "/Habit" }, { name: "HabitList", path: "/HabitList" }]
};