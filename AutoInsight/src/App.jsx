import { ToastContainer } from "react-toastify";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout.jsx";
import HomePage from "./components/HomePage/HomePage";
import Authentication from "./components/Authentication/Authentication.jsx";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout  />,
      children: [
        { path: "", element: <HomePage /> },
        { path: "home", element: <HomePage /> },
        { path: "how-it-works", element: <HomePage /> },
        { path: "about-us", element: <HomePage /> },
        { path: "contact", element: <HomePage /> },
        { path: "reviews", element: <HomePage /> }, // Reviews is a child of RootLayout
      ],
    },
    {
      path: "/login",
      element: <Authentication />,
    },
    {
      path: "/signup",
      element: <Authentication />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;