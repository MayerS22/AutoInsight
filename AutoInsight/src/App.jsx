import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout.jsx";
import HomePage from "./components/HomePage/HomePage";
import Authentication from "./components/Authentication/Authentication.jsx";
import Reviews from "./components/HomePage/Reviews.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log("App isLoggedIn:", isLoggedIn); // Debugging

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />,
      children: [
        { path: "", element: <HomePage /> },
        { path: "home", element: <HomePage /> },
        { path: "how-it-works", element: <HomePage /> },
        { path: "about-us", element: <HomePage /> },
        { path: "contact", element: <HomePage /> },
        // { path: "reviews", element: <Reviews isLoggedIn={isLoggedIn} /> }
      ],
    },
    {
      path: "/login",
      element: <Authentication setIsLoggedIn={setIsLoggedIn} />, 
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