import RobotImg from "../../../assets/Robot.svg";
export default function Header(){
    return(
        <header className="w-full py-4 px-8 flex justify-between items-center fixed top-0 left-0 bg-purple-50 shadow-md z-50">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img
              src={RobotImg}
              alt="Robot Icon"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="px-2 font-bold text-purple-900 text-2xl">
            Auto Insight
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <a
            href="#home"
            className="text-purple-900 hover:text-purple-700 hover:underline"
          >
            Home
          </a>
          <a
            href="#aboutUs"
            className="text-purple-900 hover:text-purple-700 hover:underline"
          >
            About Us
          </a>
          <a
            href="#contact"
            className="text-purple-900 hover:text-purple-700 hover:underline"
          >
            Contact
          </a>

          {/* Buttons */}
          <div className="flex space-x-2">
            <button className="bg-purple-900 text-white px-4 py-2 hover:bg-purple-600 rounded-lg">
              Login
            </button>
            <button className="text-purple-900 px-4 py-2 rounded-lg hover:bg-purple-600 hover:text-white border-2 border-purple-800 hover:border-purple-600">
              Sign Up
            </button>
          </div>
        </nav>
      </header>

    )
}