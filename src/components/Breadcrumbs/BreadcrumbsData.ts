interface Crumb {
  name: string;
  path?: string;
}

interface BreadcrumbsData {
  [key: string]: Crumb[];
}

export const breadcrumbsData: BreadcrumbsData = {
  "/": [{ name: "Home" }],
  "/history": [{ name: "Home", path: "/" }, { name: "Plans", path: "/plans" }, { name: "History" }],
  "/habit": [{ name: "Home", path: "/" }, { name: "Habit" }],
  "/plans": [{ name: "Home", path: "/" }, { name: "Plans" }],
  "/settings": [{ name: "Home", path: "/" }, { name: "Settings" }],
  "/habitlist": [{ name: "Home", path: "/" },{ name: "Habit", path: "/habit" }, { name: "Habitlist", path: "/habitList" }]
};