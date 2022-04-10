import DummyProfilePic from "../assets/images/dummy-profile-pic.png";
import { BsGear } from "react-icons/bs";
import UpdateProfile from "./UpdateProfile";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/users";
import { AuthContext } from "../context/auth";
import { ReqContext } from "../context/request";

export interface propsIFace {
  isActive: boolean;
}

const Profile = () => {
  const [accIndex, setAccIndex] = useState<number | null>(null);
  const [rejIndex, setRejIndex] = useState<number | null>(null);

  const { profileInfo, getProfile } = useContext(UserContext);
  const { user } = useContext(AuthContext);
  const {
    requests,
    reqCount,
    reqMsg,
    getReqLoading,
    getMyRequests,
    accReqSuccess,
    acceptRequest,
    rejReqSuccess,
    rejectRequest,
  } = useContext(ReqContext);

  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (accReqSuccess) {
      setAccIndex(null);
    }
    if (rejReqSuccess) {
      setRejIndex(null);
    }
    getMyRequests();
  }, [accReqSuccess, rejReqSuccess]);

  const acceptRequestHandler = (reqId: string, i: number) => {
    setAccIndex(i);
    acceptRequest(reqId);
  };

  const rejectRequestHandler = (reqId: string, i: number) => {
    setRejIndex(i);
    rejectRequest(reqId);
  };

  return (
    <div className='profile-container'>
      <div className='profile-info'>
        <div className='avatar'>
          {profileInfo?.avatar ? (
            <img src={profileInfo.avatar} alt={profileInfo.username} />
          ) : (
            <img src={DummyProfilePic} alt='Dummy Profile Picture' />
          )}
        </div>
        <div className='info'>
          <div className='user'>
            <h3 id='username'>{profileInfo.username}</h3>
            {profileInfo?.email ? (
              <address id='email'>( {profileInfo.email} )</address>
            ) : (
              <address id='email'>( no email address )</address>
            )}
            <p id='date'>Registered {profileInfo.createdAt} ago</p>
          </div>
          {!user?.providerId && (
            <div onClick={() => setShowUpdateProfile(true)} className='update'>
              <span id='text'>Update Profile</span>
              <BsGear id='icon' />
            </div>
          )}
        </div>
      </div>
      <hr />
      <div className='friend-requests'>
        <h4 id='title'>Friend Requests: {reqCount}</h4>
        <div className='requests'>
          <div
            className='request-wrapper'
            style={{
              overflowY: requests?.length > 6 ? "scroll" : "initial",
            }}
          >
            {/* {getReqLoading && <p>Loading...</p>} */}
            {reqMsg && <p id='no-reqs'>{reqMsg}</p>}
            {requests?.map((req, i) => (
              <div className='request' key={req._id}>
                <div className='req-col-1'>
                  {req.from.avatar ? (
                    <img src={req.from.avatar} alt={req.from.username} />
                  ) : (
                    <img
                      id='img'
                      src={DummyProfilePic}
                      alt='Dummy profile pic'
                    />
                  )}
                  <h5 id='name'>{req.from.username}</h5>
                </div>
                <div className='req-col-2'>
                  <h5 id='date'>{req.createdAt} ago</h5>
                </div>
                <div className='req-col-3'>
                  <div
                    onClick={() => acceptRequestHandler(req._id, i)}
                    id='accept-btn'
                  >
                    {accIndex === i ? "..." : "Accept"}
                  </div>
                  <div
                    onClick={() => rejectRequestHandler(req._id, i)}
                    id='remove-btn'
                  >
                    {rejIndex === i ? "..." : "Reject"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UpdateProfile
        showUpdProfile={showUpdateProfile}
        hideUpdProfile={() => setShowUpdateProfile(false)}
        profileInfo={profileInfo}
      />
    </div>
  );
};

export default Profile;
