import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="font-sans h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Main container */}
      <div className="container mx-auto px-4 md:px-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row justify-between gap-8 md:gap-16">
          {/* Quick Action Column */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6 text-purple-900 border-b-2 border-purple-200 pb-2">
              Quick Actions
            </h2>
            <nav className="space-y-4">
              <Link
                to="/home"
                className="block text-purple-800 hover:text-purple-600 hover:bg-purple-50 rounded-lg p-2 transition-all duration-200"
              >
                Home
              </Link>
              <Link
                to="/home"
                className="block text-purple-800 hover:text-purple-600 hover:bg-purple-50 rounded-lg p-2 transition-all duration-200"
              >
                Upload Your Dataset
              </Link>
              <Link
                to="/how-it-works"
                className="block text-purple-800 hover:text-purple-600 hover:bg-purple-50 rounded-lg p-2 transition-all duration-200"
              >
                How It Works
              </Link>
              <Link
                to="/faq"
                className="block text-purple-800 hover:text-purple-600 hover:bg-purple-50 rounded-lg p-2 transition-all duration-200"
              >
                FAQ
              </Link>
              <Link
                to="/home"
                className="block text-purple-800 hover:text-purple-600 hover:bg-purple-50 rounded-lg p-2 transition-all duration-200"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/about-us"
                className="block text-purple-800 hover:text-purple-600 hover:bg-purple-50 rounded-lg p-2 transition-all duration-200"
              >
                About Us
              </Link>
              
            </nav>
          </div>

          {/* Center Column */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-5xl font-bold text-purple-900 mb-4">
              Auto Insight
            </h2>
            <p className="text-gray-600 text-lg">
              Join our website for all automated insights.
            </p>
            <button className="mt-6 bg-purple-900 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200">
              Get Started
            </button>
          </div>

          {/* Contact Us Column */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6 text-purple-900 border-b-2 border-purple-200 pb-2">
              Contact Us
            </h2>
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-semibold text-purple-800 mb-1">
                  Helpline
                </h1>
                <p className="text-gray-600">+200101234567</p>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-purple-800 mb-1">
                  Email
                </h1>
                <p className="text-gray-600">
                  <a
                    href="mailto:Autoinsight@gmail.com"
                    className="hover:text-purple-600 transition-all duration-200"
                  >
                    Autoinsight@gmail.com
                  </a>
                </p>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-purple-800 mb-1">
                  Address
                </h1>
                <p className="text-gray-600">23 Street, Hometown</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}