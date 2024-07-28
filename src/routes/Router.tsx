import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RoutesSchema } from "./RoutesSchema";
import { createElement } from "react";
import ProtectedRoutes from "./protectedRoutes";
import Layout from "../components/Layout/Layout";

const router = createBrowserRouter(
  RoutesSchema.map((route) => ({
    ...route,
    element: (
      <Layout>
        {route.isProtected ? (
          <ProtectedRoutes requiredRole={route.requiredRole}>{createElement(route.element)}</ProtectedRoutes>
        ) : (
          createElement(route.element)
        )}
      </Layout>
    ),
    children: route.children?.map((child) => ({
      ...child,
      element: createElement(child.element),
    })),
  }))
);

function Router() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default Router;
