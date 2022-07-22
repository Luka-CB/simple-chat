import authPageImg from "../../assets/images/simple-chat-pic-2.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/features/auth";

const SignUp = () => {
  const { regError, regLoading, regSuccess, register } =
    useContext(AuthContext);

  const [errMsg, setErrMsg] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (regSuccess) {
      navigate("/");
    }
  }, [regSuccess]);

  const submitHandler = (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword)
      return setErrMsg("Passwords Does Not Match!");

    const userData = {
      username,
      email,
      password,
    };

    register(userData);
  };

  return (
    <div className="auth-container">
      <div className="logo">
        <Link to={"/"}>Simple-Chat Logo</Link>
      </div>
      <div className="image">
        <img src={authPageImg} alt="Auth page Image" />
      </div>
      <div className="auth">
        <div className="custom_auth">
          {regError && <p>{regError}</p>}
          {errMsg && <p>{errMsg}</p>}
          {regLoading && <p>Loading...</p>}
          <h5>
            Sign up with <span>Simple-Chat</span>
          </h5>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          </form>
          <div className="info">
            <h4>Already Have an Account?</h4>
            <Link to={"/signin"}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
