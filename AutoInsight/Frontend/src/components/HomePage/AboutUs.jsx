import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function AboutUs() {
  const theme = useSelector((state) => state.theme.mode);
  return (
    <section id="aboutUs" className={`${theme === "light" ? "bg-white" : "bg-dark-text-secondary"} min-h-screen flex items-center justify-center`}>
      <div className="max-w-5xl mx-auto px-4 pt-16">
        {/* Section Heading */}
        <motion.h2 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={`text-4xl md:text-5xl font-bold ${theme === "light" ? "text-purple-900" : "text-purple-300"} mb-8 text-center`}
        >
          About Us
        </motion.h2>

        {/* Section Content */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className={`text-lg md:text-xl ${theme === "light" ? "text-purple-800" : "text-purple-300"} leading-relaxed`}>
            Auto Insight was created to empower companies with the tools they need
            to make informed decisions during challenging times, such as workforce
            reductions. Our platform provides a seamless blend of data analysis,
            forecasting, and machine learning, enabling businesses to quickly
            extract insights without extensive manual work.
          </p>
          <br />

          <p className={`text-lg md:text-xl ${theme === "light" ? "text-purple-800" : "text-purple-300"} leading-relaxed mt-6`}>
            Our mission is to support companies by offering a mutually beneficial
            solution that maintains productivity and reduces costs associated with
            layoffs. With Auto Insight, organizations can navigate transitions
            confidently, leveraging automated insights to stay resilient and
            forward-thinking.
          </p>
        </motion.div>
      </div>
    </section>
  );
}