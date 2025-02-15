/* eslint-disable react/prop-types */
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Icons from react-icons

const InputField = ({ label, type, placeholder, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const labelStyle = error ? "text-red-500" : "text-purple-800";
  const inputBorderStyle = error ? "border-red-500 bg-red-100" : "border-gray-300";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mb-8 relative">
      <label className={`block font-bold ${labelStyle}`} htmlFor={type}>
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={showPassword ? "text" : type} 
          id={type}
          placeholder={placeholder}
          className={`w-full p-2 border ${inputBorderStyle} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10`}
        />
        {type === "password" && (
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <AiOutlineEye className="h-5 w-5 text-gray-500" />
            ) : (
              <AiOutlineEyeInvisible className="h-5 w-5 text-gray-500" />
            )}
          </div>
        )}
      </div>
      <p className={`text-red-500 transition-opacity duration-200 ${error ? "opacity-100" : "opacity-0"}`}>
        {error}
      </p>
    </div>
  );
};

export default InputField;