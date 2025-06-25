/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
export default function Step({ stepNumber, title, description, imageSrc, imageAlt, reverse }) {
  const theme = useSelector((state) => state.theme.mode);
  return (
    <div
      className={`flex flex-col md:flex-row items-center md:items-start md:space-x-8 ${
        reverse ? "" : "md:flex-row-reverse"
      }`}
    >
      {/* Image Section */}
      <div className="flex-shrink-0 self-center -mt-2 md:-mt-16">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-[400px] h-[291px] object-contain"
        />
      </div>
      {/* Content Section */}
      <div className="flex-1">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-900 font-bold mr-3 text-lg">
            {stepNumber}
          </div>
          <h3 className={`text-2xl font-bold ${theme === "light" ? "text-purple-900" : "text-purple-300"}`}>{title}</h3>
        </div>
        <p className={`pl-[3.25rem] text-left ${theme === "light" ? "text-purple-800" : "text-purple-300"} text-lg`}>
          {description}
        </p>
      </div>
    </div>
  );
}
