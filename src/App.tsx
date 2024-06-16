import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
} from "react-router-dom";
import Login from "./views/Login";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="about">About Us</Link>
      </div>
    ),
  },
  {
    path: "about",
    element: <div><Login/></div>,
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />{" "}
    </>
  );
}

export default App;
