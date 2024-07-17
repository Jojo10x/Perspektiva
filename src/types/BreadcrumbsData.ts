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
  "/habits": [{ name: "Home", path: "/" }, { name: "habits" }],
  "/Plans": [{ name: "Home", path: "/" }, { name: "Plans" }],
  "/goals": [{ name: "Home", path: "/" }, { name: "goals" }],
  "/Settings": [{ name: "Home", path: "/" }, { name: "Settings" }],
  "/HabitList": [{ name: "Home", path: "/" },{ name: "Habits", path: "/Habits" }, { name: "Habitlist", path: "/HabitList" }]
};