import Dashboard from "../components/Dashboard/Dashboard";
// import Layout from "../views/Layout/Layout";
import Login from "../views/Login";
import MicrositesIndex from "../views/Microsites/MicrositesIndex";
import Welcome from "../views/Welcome";

export const RoutesSchema = [
  {
    path: "/",
    element: Welcome,
  },
  {
    path: "/login",
    element: Login,
  },
  {
    path: "/dashboard",
    element: Dashboard,
    children: [
      {
        path: "",
        element: MicrositesIndex
      }
    ]
  },
  {
    path: "/",
    element: Welcome,
  },
];
