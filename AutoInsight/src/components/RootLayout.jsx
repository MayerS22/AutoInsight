import Header from "./HomePage/HomePageComponents/Header";
import { Outlet } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const RootLayout = ({userName}) => {

  return (
    <div>
      <Header userName={userName}/>
      <Outlet />
    </div>
  );
};

export default RootLayout;