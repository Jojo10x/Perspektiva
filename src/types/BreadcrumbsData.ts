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
  "/habit": [{ name: "Home", path: "/home" }, { name: "Habit" }],
  "/plans": [{ name: "Home", path: "/home" }, { name: "Plans" }],
  "/settings": [{ name: "Home", path: "/home" }, { name: "Settings" }],
  "/habitlist": [{ name: "Home", path: "/home" },{ name: "Habit", path: "/habit" }, { name: "Habitlist", path: "/habitList" }]
};