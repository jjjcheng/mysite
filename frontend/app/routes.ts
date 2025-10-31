import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx", [index("routes/a.tsx")]),
  route("new-note", "routes/new-note.tsx"),
  route("notes", "routes/notes.tsx"),
  route("note/:id", "routes/note.$id.tsx"),
] satisfies RouteConfig;
