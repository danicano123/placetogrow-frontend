import Dashboard from "../components/Dashboard/Dashboard";
import RegisterForm from "../components/Register/RegisterForm";
import Login from "../views/Login";
import MicrositesIndex from "../views/Microsites/MicrositesIndex";
import UsersDashboard from "../views/Users/UsersDashboard";
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
    path: "/register",
    element: RegisterForm,
  },
  {
    path: "/dashboard",
    element: Dashboard,
    isProtected: true,
    children: [
      {
        path: "users",
        element: UsersDashboard,
        isProtected: true,
      },
      
    ]
  },
  {
    path: "/",
    element: Welcome,
  },
];
