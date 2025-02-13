/* eslint-disable no-unused-vars */
 import { ToastContainer } from "react-toastify";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout.jsx";
import HomePage from "./components/HomePage/HomePage";
import Authentication from "./components/Authentication/Authentication.jsx";
import Profile from "./components/Profile/Profile.jsx";
import { useState } from "react";

function App() {

//  const [headerColor,setHeaderColor]=useState("bg-purple-50");
   const [userName, setUserName] = useState("");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout  userName={userName}/>,
      children: [
        { path: "", element: <HomePage /> },
        { path: "home", element: <HomePage /> },
        { path: "how-it-works", element: <HomePage /> },
        { path: "about-us", element: <HomePage /> },
        { path: "contact", element: <HomePage /> },
        { path: "reviews", element: <HomePage /> }, // Reviews is a child of RootLayout
        { path: "faq", element: <HomePage /> }, 
        { path: "profile", element: <Profile userName={userName}/> }, // DatasetPage is a child of RootLayout
      ],
    },
    {
      path: "/login",
      element: <Authentication setUserName={setUserName}/>,
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