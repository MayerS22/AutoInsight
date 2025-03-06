 
 import { ToastContainer } from "react-toastify";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout.jsx";
import HomePage from "./components/HomePage/HomePage";
import Authentication from "./components/Authentication/Authentication.jsx";
import Profile from "./components/Profile/Profile.jsx";
import { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "./store/index.js"
import Dashboard from "./components/Profile/Dashboard.jsx";
import DashboardListComponent from "./components/Profile/DashboardList.jsx";
import DashboardSetupFlow from "./components/Profile/UploadDatasetWizard.jsx";


function App() {

//  const [headerColor,setHeaderColor]=useState("bg-purple-50");
   const [userName, setUserName] = useState("");

   const dispatch = useDispatch();

   useEffect(() => {
     const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
     const email = localStorage.getItem("email");
     const token = localStorage.getItem("token");
 
     if (isLoggedIn && email) {
       dispatch(authActions.login({ email ,token})); // Restore Redux state
     }
   }, [dispatch]);

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
        { path: "reviews", element: <HomePage /> }, 
        { path: "faq", element: <HomePage /> }, 
        { path: "profile", element: <Profile /> },
        { path: "dashboards", element: <DashboardListComponent isStandAlone={true}/> },
        { path: "dashboard/:id", element: <Dashboard /> },
        { path: "wizard", element: <DashboardSetupFlow /> }
        
       
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
    {
      path: "/forgot-password",
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