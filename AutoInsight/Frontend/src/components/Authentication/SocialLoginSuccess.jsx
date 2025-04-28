import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { authActions } from '../../store/index';
import { jwtDecode } from "jwt-decode";
import { fetchUserProfile } from "../../services/Api_Services";
import { toast } from 'react-toastify';
const SocialLoginSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
  
    if (token) {
      localStorage.setItem('token', token);
  
      const decodedToken = jwtDecode(token); 
      const email = decodedToken.id; // <-- now you get the email!
      console.log(decodedToken);
      console.log(email);
      console.log(token);
      fetchUserProfile(token,authActions,dispatch);
      
      
      
      toast.success("Login Successful!");

      dispatch(authActions.login({ email, token }));
      
      setTimeout(() => {
        navigate('/');
      }, 100); 
      
    }
  }, [navigate, dispatch]);
  return <div>Logging you in...</div>;
};

export default SocialLoginSuccess;
