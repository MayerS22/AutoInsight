/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import InputField from "../Authentication/AuthenticationComponents/InputField";
import SocialButton from '../Authentication/AuthenticationComponents/SocialButton';
import ToggleButton from '../Authentication/AuthenticationComponents/ToggleButton';
import Divider from '../Authentication/AuthenticationComponents/Divider';
import { isEmailValid, hasMinLength } from "../../util/validation";
import Robot from "../../assets/Robot.svg";
import AppleLogo from "../../assets/Apple.svg";
import GoogleLogo from "../../assets/Google.svg";
import FacebookLogo from "../../assets/Facebook.svg";
import GithubLogo from "../../assets/Github.png";
import HideLogo from "../../assets/Hide.svg";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from "../../store/index"
import axios from "axios";


const Login = ({ toggleForm, setUserName }) => {
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
  const token = localStorage.getItem("token");
  // console.log(token);


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (identifier, value) => {
    setErrors(prev => ({ ...prev, [identifier]: "", loginError: "" }));
    setEdited(prev => ({ ...prev, [identifier]: false }));
    setFormData(prev => ({ ...prev, [identifier]: value }));
  };

  const handleBlur = (identifier) => {
    setEdited(prev => ({ ...prev, [identifier]: true }));
  };




  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEmailValid(formData.email) || !hasMinLength(formData.password, 8)) {
      setErrors({
        loginError: "Please fix the form errors before submitting."
      });
      return;
    }

   
    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { token } = response.data.body; // ✅ Extract token from response
      console.log(response.data);

      const email = formData.email;

      toast.success("Login successful");
      const redirectUrl = localStorage.getItem("redirectUrl") || "/";
      localStorage.removeItem("redirectUrl");

      navigate("/home");
      dispatch(authActions.login({ email, token }));
      console.log("Login Form token" + token);
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setErrors({ loginError: "Invalid email or password. Please try again." });
      } else {
        setErrors({ loginError: "Something went wrong. Please try again later." });
      }
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
        <button onClick={() => { navigate("/forgot-password") }} className='text-purple-950 underline'>Forgot password?</button>
        <div className="flex justify-center">
          <button className="w-2/3 bg-purple-900 text-white p-2 rounded-lg hover:bg-purple-800 mt-6 font-bold">
            Login
          </button>
        </div>
      </form>

      <Divider />

      <div className="mt-4 space-y-2">
        <SocialButton icon={GoogleLogo} text="Continue with Google" type="google" />
        <SocialButton icon={FacebookLogo} text="Continue with Facebook" type="facebook" />
        <SocialButton icon={GithubLogo} text="Continue with Github" type="github" />
      </div>

      <ToggleButton isSignUp={false} onClick={toggleForm} />
    </>
  );
};

export default Login;
