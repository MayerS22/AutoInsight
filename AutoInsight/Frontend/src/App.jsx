 
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
import ForgotPassword from "./components/Authentication/ForgotPassword.jsx";
import ResetPassword from "./components/Authentication/ResetPassword.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import ReviewsAnalysis from "./components/Admin/ReviewAnalysisTable.jsx";
import DesktopNotification from "./components/HomePage/DesktopNotifiation.jsx";
import SocialLoginSuccess from "./components/Authentication/SocialLoginSuccess.jsx";

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
        { path: "wizard", element: <DashboardSetupFlow /> },
        { path: "admin", element: <AdminDashboard /> },
        { path:"notification", element:<DesktopNotification/>},
        {path: "successLoginPage",element:<SocialLoginSuccess/>},
        {
          path: "admin",
          element: <AdminDashboard />
        },
        {
          path: "admin/reviews-analysis",
          element: <ReviewsAnalysis />
        }
      
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
      element: <ForgotPassword />,
    },
    {
      path:"/reset-password/:token",
      element:<ResetPassword/>
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;