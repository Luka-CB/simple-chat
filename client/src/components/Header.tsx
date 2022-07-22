import { useContext, useEffect } from "react";
import DummyProfPic from "../assets/images/Dummy-profile-pic.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/features/auth";

const Header = () => {
  const { user, logout, logoutSuccess } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (logoutSuccess) {
      navigate("/");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [logoutSuccess]);

  const logoutOauth = () => {
    window.open("http://localhost:5000/api/auth/logout", "_self");
    localStorage.removeItem("userInfo");
  };

  return (
    <div className="header">
      <h1>Logo App Name</h1>
      {user?.id ? (
        <div className="loggedin">
          <p onClick={user?.providerId ? logoutOauth : () => logout()}>
            sign out
          </p>
          <div className="profile_pic">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <img src={DummyProfPic} alt="Dummy Profile Picture" />
            )}
          </div>
        </div>
      ) : (
        <div className="loggedout">
          <Link to={"/signin"}>Sign In</Link>
        </div>
      )}
    </div>
  );
};

export default Header;
