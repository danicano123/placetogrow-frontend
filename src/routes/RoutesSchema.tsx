import Dashboard from "../components/Dashboard/Dashboard";
import PaymentOverviewLayout from "../components/Layout/PaymentOverviewLayout";
import RegisterForm from "../components/Register/RegisterForm";
import EditMicrositeForm from "../views/Forms/EditMicrositeForm";
import PaymentForm from "../views/Forms/PaymentForm";
import SubscriptionForm from "../views/Forms/SubscriptionForm";
import Login from "../views/Login";
import CreateMicrosite from "../views/Microsites/CreateMicrosite";
import EditMicrosite from "../views/Microsites/EditMicrosites";
import MicrositesDashboard from "../views/Microsites/MicrositesDashboard";
import MicrositeDetail from "../views/Microsites/MicrositesDetail";
import MicrositesList from "../views/Microsites/MicrositesList";
import PaymentOverview from "../views/Payments/PaymentOverview";
import PaymentsDashboard from "../views/Payments/PaymentsDashboard";
import PaymentsList from "../views/Payments/PaymentsList";
import EditUser from "../views/Users/EditUsers";
import UsersDashboard from "../views/Users/UsersDashboard";

export const RoutesSchema = [
  {
    path: "/",
    element: MicrositesList,
  },
  {
    path: "/microsites/:slug",
    element: MicrositeDetail,
    isProtected: true,
  },
  {
    path: "/microsites/payments/:slug/form/:micrositeId",
    element: PaymentForm,
    isProtected: true,
  },
  {
    path: "/payment-overview/:id",
    element: PaymentForm,
    isProtected: true,
  },
  {
    path: "/microsites/subscriptions/:slug/form/:micrositeId",
    element: SubscriptionForm,
    isProtected: true,
  },
  {
    path: "*",
    element: MicrositesList,
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
    path: "/payments",
    element: PaymentsList,
    isProtected: true,
  },
  {
    path: "/payment-details",
    element: PaymentOverviewLayout,
    isProtected: true,
    children: [
      {
        path: ":id",
        element: PaymentOverview,
      },
    ],
  },
  {
    path: "/dashboard",
    element: Dashboard,
    isProtected: true,
    requiredRole: "admin",
    children: [
      {
        path: "users",
        element: UsersDashboard,
      },
      {
        path: "users/:id",
        element: EditUser,
      },
      {
        path: "microsites",
        element: MicrositesDashboard,
      },
      {
        path: "microsites/:id",
        element: EditMicrosite,
      },
      {
        path: "microsites/create-microsite",
        element: CreateMicrosite,
      },
      {
        path: "microsites/form/:microsite_id",
        element: EditMicrositeForm,
      },
      {
        path: "microsites/payments/:micrositeId",
        element: PaymentsDashboard,
      },
    ],
  },
];
