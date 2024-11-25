import '../styles/LoginPage.css';
import loginImage from '../assets/AutoInsight.png'; // Replace with your actual image file if needed
import Robot from '../assets/Robot.png'; // Replace with your actual image file if needed
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa'; // Import icons

const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-form">
                    <div className="welcome-text">
                        <img src={Robot} alt="Robot Photo" style={{width:"30%"}} />
                        <h2>Nice to see you again</h2>
                        <h1>Welcome Back</h1>
                    </div>
                    <form>
                        <div className="input-field">
                            <label>Email</label>
                            <input type="email" placeholder="Enter your email" required />
                        </div>
                        <div className="input-field">
                            <label>Password</label>
                            <input type="password" placeholder="Enter your password" required />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    <div className="divider">
                        <span className="line"></span>
                        <span>OR</span>
                        <span className="line"></span>
                    </div>

                    <div className="social-login-buttons">
                        <button className="social-button google">
                            <FaGoogle style={{ position: "relative", right: "62px" }} /> <span>Continue with Google</span>
                        </button>
                        <button className="social-button facebook">
                            <FaFacebookF style={{ position: "relative", right: "50px" }} /> <span>Continue with Facebook</span>
                        </button>
                        <button className="social-button apple">
                            <FaApple style={{ position: "relative", right: "69px" }} /> <span>Continue with Apple</span>
                        </button>
                    </div>
                    <p className="signup-text">
                        <span>Don’t have an account?</span> <a href="#">Sign Up</a>
                    </p>
                </div>
                <div className="login-image">
                    <img src={loginImage} alt="Login Visual" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
