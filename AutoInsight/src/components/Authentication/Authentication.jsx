import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import Illustration from "../../assets/Illustration.svg";

const AuthContainer = ({setIsLoggedIn,isLoggedIn}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(location.state?.isSignUp || false);

  useEffect(() => {
    if (isSignUp) {
      navigate('/signup', { replace: true }); 
    } else {
      navigate('/login', { replace: true }); 
    }
  }, [isSignUp, navigate]);
  //3shan n update el url lma el form ttghyr

  const toggleForm = () => {
    setIsSignUp((prev) => !prev); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div
        className="bg-white shadow-lg rounded-2xl flex w-full max-w-[1250px] overflow-hidden"
        style={{ height: '1170px' }}
      >
        {/* Form Section */}
        <div
          className={`w-full md:w-1/2 p-8 pl-25 pr-17 flex flex-col justify-center transition-transform duration-500 ease-in-out ${
            isSignUp ? 'md:transform md:translate-x-full' : ''
          }`}
        >
          {isSignUp ? (
            <SignUpForm toggleForm={toggleForm} />
          ) : (
            <LoginForm setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} toggleForm={toggleForm} />
          )}
        </div>

        {/* Image Section */}
        <div
          className={`hidden md:block w-1/2 bg-purple-100 rounded-r-2xl transition-transform duration-500 ease-in-out ${
            isSignUp ? 'md:transform md:-translate-x-full' : ''
          } relative`}
        >
          <img
            src={Illustration}
            alt="Illustration"
            className="max-h-[70%] max-w-[70%] object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;