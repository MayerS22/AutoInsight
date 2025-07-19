import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function Contact() {
  const theme = useSelector((state) => state.theme.mode);
  return (
    <div className={`font-sans min-h-screen flex justify-center items-center ${theme === "light" ? "bg-purple-50" : "bg-dark-text-secondary"}`}>
      {/* Main container */}
      <div className="container mx-auto px-4 md:px-12">
        <div className={`${theme === "light" ? "bg-white" : "bg-dark-background"} rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row justify-between gap-8 md:gap-16`}>
          {/* Quick Actions Column */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/4"
          >
            <h2 className={`text-2xl font-bold mb-6 ${theme === "light" ? "text-purple-900" : "text-purple-300"} border-b-2 ${theme === "light" ? "border-purple-200" : "border-purple-800"} pb-2`}>
              Quick Actions
            </h2>
            <nav className="space-y-4">
              <Link
                to="/home"
                className={`block ${theme === "light" ? "text-purple-800 hover:text-purple-600 hover:bg-purple-50" : "text-purple-400 hover:text-purple-300 hover:bg-dark-background"} rounded-lg p-2 transition-all duration-200`}
              >
                Home
              </Link>
              <Link
                to="/home"
                className={`block ${theme === "light" ? "text-purple-800 hover:text-purple-600 hover:bg-purple-50" : "text-purple-400 hover:text-purple-300 hover:bg-dark-background"} rounded-lg p-2 transition-all duration-200`}
              >
                Upload Your Dataset
              </Link>
              <Link
                to="/how-it-works"
                className={`block ${theme === "light" ? "text-purple-800 hover:text-purple-600 hover:bg-purple-50" : "text-purple-400 hover:text-purple-300 hover:bg-dark-background"} rounded-lg p-2 transition-all duration-200`}
              >
                How It Works
              </Link>
              <Link
                to="/faq"
                className={`block ${theme === "light" ? "text-purple-800 hover:text-purple-600 hover:bg-purple-50" : "text-purple-400 hover:text-purple-300 hover:bg-dark-background"} rounded-lg p-2 transition-all duration-200`}
              >
                FAQ
              </Link>
              <Link
                to="/about-us"
                className={`block ${theme === "light" ? "text-purple-800 hover:text-purple-600 hover:bg-purple-50" : "text-purple-400 hover:text-purple-300 hover:bg-dark-background"} rounded-lg p-2 transition-all duration-200`}
              >
                About Us
              </Link>
            </nav>
          </motion.div>

          {/* Center Column */}
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 flex flex-col items-center justify-center text-center md:-translate-x-4"
          >
            <h2 className={`text-5xl font-bold ${theme === "light" ? "text-purple-900" : "text-purple-300"} mb-4`}>
              Auto Insight
            </h2>
            <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"} text-lg`}>
              Join our website for all automated insights.
            </p>
          </motion.div>

          {/* Contact Us Column */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/4"
          >
            <h2 className={`text-2xl font-bold mb-6 ${theme === "light" ? "text-purple-900" : "text-purple-300"} border-b-2 ${theme === "light" ? "border-purple-200" : "border-purple-800"} pb-2`}>
              Contact Us
            </h2>
            <div className="space-y-6">
              <div>
                <h1 className={`text-xl font-semibold ${theme === "light" ? "text-purple-800" : "text-purple-400"} mb-1`}>
                  Helpline
                </h1>
                <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>+200101234567</p>
              </div>
              <div>
                <h1 className={`text-xl font-semibold ${theme === "light" ? "text-purple-800" : "text-purple-400"} mb-1`}>
                  Email
                </h1>
                <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                  <a
                    href="mailto:Autoinsight@gmail.com"
                    className={`${theme === "light" ? "hover:text-purple-600" : "hover:text-purple-300"} transition-all duration-200`}
                  >
                    Autoinsight@gmail.com
                  </a>
                </p>
              </div>
              <div>
                <h1 className={`text-xl font-semibold ${theme === "light" ? "text-purple-800" : "text-purple-400"} mb-1`}>
                  Address
                </h1>
                <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>23 Street, Hometown</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
