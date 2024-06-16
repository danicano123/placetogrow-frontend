import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RoutesSchema } from "./RoutesSchema";
import { createElement } from "react";
const router = createBrowserRouter(
  RoutesSchema.map((route) => ({
    ...route,
    element: createElement(route.element),
    children: route.children?.map((child) => ({
      ...child,
      element: createElement(child.element),
    })),
  }))
);
function Router() {
  return (
    <>
      <RouterProvider router={router} />{" "}
    </>
  );
}

export default Router;
