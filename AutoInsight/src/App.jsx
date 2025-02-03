import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout.jsx";
import HomePage from "./components/HomePage/HomePage";
import Authentication from "./components/Authentication/Authentication.jsx";
import Reviews from "./components/HomePage/Reviews.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  console.log("App isLoggedIn:", isLoggedIn); // Debugging

  const handleLoginSuccess = (userDetails) => {
    setIsLoggedIn(true);
    setUser(userDetails);
  };

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
        { path: "reviews", element: <Reviews /> }, // Reviews is a child of RootLayout
      ],
    },
    {
      path: "/login",
      element: <Authentication setIsLoggedIn={setIsLoggedIn} setUser={setUser} />,
    },
    {
      path: "/signup",
      element: <Authentication setIsLoggedIn={setIsLoggedIn} setUser={setUser} />,
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