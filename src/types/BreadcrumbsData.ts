interface Crumb {
  name: string;
  path?: string;
}

interface BreadcrumbsData {
  [key: string]: Crumb[];
}

export const breadcrumbsData: BreadcrumbsData = {
  "/home": [{ name: "Home" }],
  "/history": [{ name: "Home", path: "/home" }, { name: "Plans", path: "/plans" }, { name: "History" }],
  "/habits": [{ name: "Home", path: "/home" }, { name: "Habits" }],
  "/plans": [{ name: "Home", path: "/home" }, { name: "Plans" }],
  "/goals": [{ name: "Home", path: "/home" }, { name: "Goals" }],
  "/settings": [{ name: "Home", path: "/home" }, { name: "Settings" }],
  "/habitlist": [{ name: "Home", path: "/home" },{ name: "Habits", path: "/habits" }, { name: "Habitlist", path: "/habitlist" }]
};