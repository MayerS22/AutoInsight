/* eslint-disable react/prop-types */
import { useState } from 'react';
import InputField from "../Authentication/AuthenticationComponents/InputField";
import SocialButton from '../Authentication/AuthenticationComponents/SocialButton';
import ToggleButton from '../Authentication/AuthenticationComponents/ToggleButton';
import Divider from '../Authentication/AuthenticationComponents/Divider';
import { isEmailValid, hasMinLength } from "../../util/validation";
import { userCredentials } from "../../util/credentials";
import Robot from "../../assets/Robot.svg";
import AppleLogo from "../../assets/Apple.svg";
import GoogleLogo from "../../assets/Google.svg";
import FacebookLogo from "../../assets/Facebook.svg";
import HideLogo from"../../assets/Hide.svg";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = ({ toggleForm,setIsLoggedIn,isLoggedIn}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    loginError: ""
  });

  const [edited, setEdited] = useState({
    email: false,
    password: false
  });

  

  const navigate = useNavigate();

  const handleInputChange = (identifier, value) => {
    setErrors(prev => ({ ...prev, [identifier]: "", loginError: "" }));
    setEdited(prev => ({ ...prev, [identifier]: false }));
    setFormData(prev => ({ ...prev, [identifier]: value }));
  };

  const handleBlur = (identifier) => {
    setEdited(prev => ({ ...prev, [identifier]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const isValidUser = userCredentials.some(
      user => user.email === formData.email && user.password === formData.password
    );

    if (!isEmailValid(formData.email) || !hasMinLength(formData.password, 6)) {
      setErrors({
        loginError: "Please fix the form errors before submitting."
      });
      return;
    }

    if (isValidUser) {
      toast.success("Login successful");
      navigate('/');
      setErrors({ loginError: "" });
      setIsLoggedIn(true);
      // console.log("Login form isLoggedIn : "+isLoggedIn);
      
    } else {
      setErrors({
        loginError: "Invalid email or password. Please try again."
      });
    }
  };

  return (
    <>
     <div className='flex flex-col '></div>
      <div className="text-center relative bottom-32">
        <img src={Robot} alt="Logo" className="mx-auto mb-6 w-1/6 " />
        <h2 className="text-2xl  text-purple-900">
          Nice to see you again
        </h2>
        <h1 className="text-6xl font-bold text-purple-900 mr-7">
          Welcome Back
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 ">
        <InputField
          label="Email"
          placeholder="Enter your Email"
          onChange={(e) => handleInputChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          value={formData.email}
          error={edited.email && !isEmailValid(formData.email) ? "Please enter a valid email" : ""}
        />
        
        <InputField
          label="Password"
          type="password"
          placeholder="Enter your Password"
          onChange={(e) => handleInputChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          value={formData.password}
          error={edited.password && !hasMinLength(formData.password, 8) ? 
            "Password must be at least 8 characters long." : ""}
          icon={HideLogo}
        />

        {errors.loginError && (
          <div className="flex justify-center">
            <p className="w-2/3 text-red-500 transition-opacity duration-200">
              {errors.loginError}
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <button className="w-2/3 bg-purple-900 text-white p-2 rounded-lg hover:bg-purple-800 mt-6 font-bold">
            Login
          </button>
        </div>
      </form>

      <Divider />

      <div className="mt-4 space-y-2">
        <SocialButton icon={GoogleLogo} text="Continue with Google" />
        <SocialButton icon={FacebookLogo} text="Continue with Facebook" />
        <SocialButton icon={AppleLogo} text="Continue with Apple" />
      </div>

      <ToggleButton isSignUp={false} onClick={toggleForm} />
    </>
  );
};

export default Login;
