import authPageImg from "../../assets/images/simple-chat-pic-2.png";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/features/auth";

const SignIn = () => {
  const { login, loginSuccess, loginError, loginLoading } =
    useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (loginSuccess) {
      navigate("/");
    }
  }, [loginSuccess]);

  const google = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  const facebook = () => {
    window.open("http://localhost:5000/api/auth/facebook", "_self");
  };

  const submitHandler = (e: any) => {
    e.preventDefault();

    const userData = {
      username,
      password,
    };

    login(userData);
  };

  return (
    <div className="auth-container">
      <div className="logo">
        <Link to={"/"}>Simple-Chat Logo</Link>
      </div>
      <div className="image">
        <img src={authPageImg} alt="Auth Page Image" />
      </div>
      <div className="auth">
        <div className="oauth">
          <div onClick={google} className="oauth_btn">
            <div className="icon">
              <FcGoogle />
            </div>
            <p>Sign in with Google</p>
          </div>
          <div onClick={facebook} className="oauth_btn">
            <div className="icon">
              <FaFacebook className="icon_fc" />
            </div>
            <p>Sign in with Facebook</p>
          </div>
        </div>
        <div className="or">
          <strong>OR</strong>
        </div>
        <div className="custom_auth">
          <h5>
            Sign in with <span>Simple-Chat</span>
          </h5>
          {loginLoading && <p>Loading...</p>}
          {loginError && <p>{loginError}</p>}
          <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign In</button>
          </form>
          <div className="info">
            <h4>Don't Have an Account?</h4>
            <Link to={"/signup"}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
