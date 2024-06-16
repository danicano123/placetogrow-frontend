import Login from "../views/Login";
import MicrositesList from "../views/Microsites/Microsites";
import Welcome from "../views/Welcome";

export const routes = [
  {
    path: "/",
    element: Welcome,
  },
  {
    path: "/login",
    element: Login,
  },
  {
    path: "/my-microsites",
    element: MicrositesList,
  },
  {
    path: "/",
    element: Welcome,
  },
];
