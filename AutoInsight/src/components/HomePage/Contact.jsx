import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="font-sans h-screen flex justify-center items-center">
      {/* Main container */}
      <div className="container mx-auto md:px-12 rounded-lg">
        <div className="flex flex-col md:flex-row justify-center text-center gap-12">
          {/* Quick Action Column */}
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-4 text-black">
              Quick Actions
            </h2>
            <Link to="/home" className="block text-purple-950 hover:underline">
              Home
            </Link>
            <Link
              to="/home"
              className="block text-purple-950 hover:underline"
            >
              Upload Your Dataset
            </Link>
            <Link
              to="/how-it-works"
              className="block text-purple-950 hover:underline"
            >
              How It Works
            </Link>
            <Link
              to="/home"
              className="block text-purple-950 hover:underline"
            >
              Terms & Conditions
            </Link>
            <Link to="/about-us" className="block text-purple-950 hover:underline">
              About Us
            </Link>
          </div>

          {/* Center Column */}
          <div className="flex-1">
            <h2 className="text-5xl font-bold text-purple-900">Auto Insight</h2>
            <p className="text-gray-400 text-lg mt-2">
              Join our website for all automated insights.
            </p>
          </div>

          {/* Contact Us Column */}
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-4 text-purple-950">
              Contact Us
            </h2>

            <div className="mb-2">
              <h1 className="text-xl text-black font-bold">Helpline</h1>
              <p className="text-gray-400">+200101234567</p>
            </div>

            <div className="mb-2">
              <h1 className="text-xl text-black font-bold">Email</h1>
              <p className="text-gray-400">
                <a
                  href="mailto:Autoinsight@gmail.com"
                  className="text-gray-400 hover:underline"
                >
                  Autoinsight@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h1 className="text-xl text-black font-bold">Address</h1>
              <p className="text-gray-400">23 Street, Hometown</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
