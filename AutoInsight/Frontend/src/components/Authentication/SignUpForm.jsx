/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios"; // ✅ Import Axios
import InputField from "../Authentication/AuthenticationComponents/InputField";
import ToggleButton from "../Authentication/AuthenticationComponents/ToggleButton";
import { isNotEmpty, isEmailValid, isPasswordValid } from "../../util/validation";
import Robot from "../../assets/Robot.svg";
import HideLogo from "../../assets/Hide.svg";
import { toast } from "react-toastify";

const SignUp = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (identifier, value) => {
    setErrors((prev) => ({ ...prev, [identifier]: "" }));
    setFormData((prev) => ({ ...prev, [identifier]: value }));
  };

  const validateForm = () => {
    const newErrors = {
      userName: !isNotEmpty(formData.userName) ? "Username is required." : "",
      email: !isEmailValid(formData.email) ? "Please enter a valid email address." : "",
      password: !isPasswordValid(formData.password)
        ? "Password must be at least 8 characters, include one uppercase letter, one number, and one special character."
        : "",
      confirmPassword: formData.password !== formData.confirmPassword ? "Passwords do not match." : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (validateForm()) {
      const requestData = {
        username: formData.userName,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      };
  
      try {
        const response = await axios.post("http://localhost:3000/api/v1/auth/signup", requestData, {
          headers: { "Content-Type": "application/json" },
          
        });
  
        toast.success("Sign up successful!");
        console.log("Signup response:", response.data);
        toggleForm();
      } catch (error) {
        console.error("Full error response:", error.response?.data);
  
        if (error.response) {
          const { message } = error.response.data;
          
          if (message.includes("Username")) {
           setErrors(prevErrors=>({
            ...prevErrors,
             userName: message,
           }))
          } else if (message.includes("Email")) {
            setErrors(prevErrors=>({
              ...prevErrors,
               email: message,
             }))
          } else if (message.includes("Password")) {
            setErrors(prevErrors=>({
              ...prevErrors,
               password: message,
             })) 
          }
  
        }
        }
    }
  };
  
  
  

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col items-center text-center relative bottom-20">
        <img src={Robot} alt="Logo" className="mx-auto mb-2 w-1/6" />
        <h2 className="text-2xl text-purple-900">Join us by creating an account</h2>
        <h1 className="text-6xl font-bold text-purple-900">Hi There!</h1>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Username"
          type="text"
          placeholder="Enter your Username"
          onChange={(e) => handleInputChange("userName", e.target.value)}
          value={formData.userName}
          error={errors.userName}
        />

        <InputField
          label="Email"
          placeholder="Enter your Email"
          onChange={(e) => handleInputChange("email", e.target.value)}
          value={formData.email}
          error={errors.email}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Enter your Password"
          onChange={(e) => handleInputChange("password", e.target.value)}
          value={formData.password}
          error={errors.password}
          icon={HideLogo}
        />

        <InputField
          label="Confirm Password"
          type="password"
          placeholder="Confirm your Password"
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          value={formData.confirmPassword}
          error={errors.confirmPassword}
          icon={HideLogo}
        />

        <p className="text-gray-400">
          Use 8 or more characters with at least one capital letter, a number, and a special character. By signing up, you agree to the{" "}
          <span className="text-black font-semibold">Terms of use</span> and <span className="text-black font-semibold">Privacy Policy</span>
        </p>

        <div className="flex justify-center">
          <button className="w-2/3 bg-purple-900 text-white p-2 rounded-lg hover:bg-purple-800 mt-6 font-bold">
            Sign Up
          </button>
        </div>
      </form>

      <ToggleButton isSignUp={true} onClick={toggleForm} />
    </>
  );
};

export default SignUp;
