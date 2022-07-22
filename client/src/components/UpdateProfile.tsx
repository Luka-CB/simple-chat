import { useContext, useEffect, useState } from "react";
import { FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { StateContext } from "../context/features/states";
import { UserContext, userIFace } from "../context/features/users";
import DeleteModal from "./DeleteModal";

interface propsIFace {
  showUpdProfile: boolean;
  hideUpdProfile: () => void;
  profileInfo: userIFace;
}

const UpdateProfile: React.FC<propsIFace> = ({
  showUpdProfile,
  hideUpdProfile,
  profileInfo,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { showDeleteModal, showDeleteModalHandler } = useContext(StateContext);
  const { updLoading, updSuccess, updError, updateProfile, getProfile } =
    useContext(UserContext);

  useEffect(() => {
    if (profileInfo) {
      setUsername(profileInfo.username);
      setEmail(profileInfo.email);
      setPassword(profileInfo.password);
    }
  }, [profileInfo]);

  useEffect(() => {
    if (updSuccess) {
      hideUpdProfile();
      getProfile();
    }
  }, [updSuccess]);

  const submitHandler = (e: any) => {
    e.preventDefault();

    updateProfile({
      username,
      email,
      password,
    });
  };

  return (
    <>
      {showUpdProfile && (
        <div className="update-profile-container">
          <div onClick={hideUpdProfile} className="close-icon">
            <FaTimesCircle />
          </div>
          {updLoading && <p>Loading...</p>}
          {updError && <p>{updError}</p>}
          <div className="wrapper">
            <div className="del-account">
              <h3 id="del-text">Delete Account</h3>
              <span id="middle">{">>>>>>"}</span>
              <div
                onClick={() => showDeleteModalHandler(true)}
                className="del-btn"
              >
                <FaTrashAlt id="del-icon" />
                <span id="btn-text">Delete</span>
              </div>
            </div>
            <hr />
            <div className="upd-account">
              <h2 id="upd-text">Update Profile</h2>
              <form onSubmit={submitHandler}>
                <div className="input-box">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Update Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Update Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Update Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button id="upd-btn">Update</button>
              </form>
            </div>
          </div>

          {showDeleteModal && (
            <DeleteModal
              text={"Are you sure? You are deleting your"}
              textBold={"account!"}
            />
          )}
        </div>
      )}
    </>
  );
};

export default UpdateProfile;
