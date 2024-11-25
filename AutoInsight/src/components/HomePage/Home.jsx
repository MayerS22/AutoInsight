

import TabelAnalysis from "../../assets/Work automation, console control.svg";
import CuteRobot from "../../assets/cute robot.svg";
import Header from "./HomePageComponents/Header";
export default function Home() {
  return (
    <div>
      {/* Header */}
      <Header/>
      {/* Main Content */}
      <div id="home" className="pt-[30px]">
        {/* Hero Section */}
        <main className="flex-grow flex items-center justify-between md:px-10">
          {/* Left Content */}
          <div className="max-w-2xl pt-20">
            <h2 className="text-2xl md:text-5xl font-bold text-purple-900">
              Empowering companies with instant data analytics.
            </h2>
            <p className="mt-4 text-purple-900 text-lg">
              Advanced analytics made simple for everyone—from data analysts to
              non-technical users.
            </p>
            <button className="mt-6 bg-purple-900 text-white px-6 py-3 rounded hover:bg-purple-600">
              Load Dataset
            </button>
          </div>

          {/* Right Illustration */}
          <div className="flex flex-col items-center pt-20">
            <img
              src={TabelAnalysis}
              alt="Tablet Analytics Illustration"
              className="max-w-full h-auto"
            />
            <img
              src={CuteRobot}
              alt="Cute Robot"
              className="w-40 h-40 md:w-80 mt-8 pl-20"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
