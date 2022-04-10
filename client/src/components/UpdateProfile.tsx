import { useContext, useEffect, useState } from "react";
import { FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { UserContext, userIFace } from "../context/users";

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
  const { updLoading, updSuccess, updError, updateProfile, getProfile } =
    useContext(UserContext);

  const [showDelWarning, setShowDelWarning] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <div className='update-profile-container'>
          <div onClick={hideUpdProfile} className='close-icon'>
            <FaTimesCircle />
          </div>
          {updLoading && <p>Loading...</p>}
          {updError && <p>{updError}</p>}
          <div className='wrapper'>
            <div className='del-account'>
              <h3 id='del-text'>Delete Account</h3>
              <span id='middle'>{">>>>>>"}</span>
              <div onClick={() => setShowDelWarning(true)} className='del-btn'>
                <FaTrashAlt id='del-icon' />
                <span id='btn-text'>Delete</span>
              </div>
            </div>
            <hr />
            <div className='upd-account'>
              <h2 id='upd-text'>Update Profile</h2>
              <form onSubmit={submitHandler}>
                <div className='input-box'>
                  <label>Username</label>
                  <input
                    type='text'
                    placeholder='Update Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className='input-box'>
                  <label>Email</label>
                  <input
                    type='email'
                    placeholder='Update Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='input-box'>
                  <label>Password</label>
                  <input
                    type='password'
                    placeholder='Update Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button id='upd-btn'>Update</button>
              </form>
            </div>
          </div>

          {showDelWarning && (
            <div
              className='del-warning-bg'
              onClick={() => setShowDelWarning(false)}
            >
              <div
                className='del-warning-container'
                onClick={(e) => e.stopPropagation()}
              >
                <p id='warn-text'>
                  Are you sure? You are deleting your <b>account!</b>
                </p>
                <div className='btns'>
                  <button id='yes'>Yes</button>
                  <button onClick={() => setShowDelWarning(false)} id='no'>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UpdateProfile;
