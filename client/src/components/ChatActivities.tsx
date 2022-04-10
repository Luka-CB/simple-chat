import { useState } from "react";
import { Link } from "react-router-dom";
import Friends from "./Friends";
import Groups from "./groups/Groups";
import Profile from "./Profile";
import SearchFriend from "./SearchFriend";

const ChatActivities = () => {
  const [isProfileActive, setIsProfileActive] = useState(true);
  const [isFriendsActive, setIsFriendsActive] = useState(false);
  const [isGroupsActive, setIsGroupsActive] = useState(false);

  return (
    <div className='chat-activities'>
      <div className='logo'>
        <Link to={"/"}>
          <h1>LOGO</h1>
        </Link>
      </div>
      <SearchFriend />
      <nav>
        <h3
          onClick={() => {
            setIsProfileActive(true);
            setIsFriendsActive(false);
            setIsGroupsActive(false);
          }}
          className={isProfileActive ? "nav-item-active" : "nav-item"}
        >
          Profile
        </h3>
        <h3
          onClick={() => {
            setIsFriendsActive(true);
            setIsProfileActive(false);
            setIsGroupsActive(false);
          }}
          className={isFriendsActive ? "nav-item-active" : "nav-item"}
        >
          Friends
        </h3>
        <h3
          onClick={() => {
            setIsGroupsActive(true);
            setIsProfileActive(false);
            setIsFriendsActive(false);
          }}
          className={isGroupsActive ? "nav-item-active" : "nav-item"}
        >
          Groups
        </h3>
      </nav>
      {isFriendsActive && <Friends isActive={isFriendsActive} />}
      {isProfileActive && <Profile />}
      {isGroupsActive && <Groups isActive={isGroupsActive} />}
    </div>
  );
};

export default ChatActivities;
