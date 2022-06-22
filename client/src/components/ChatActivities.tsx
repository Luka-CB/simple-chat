import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Friends from "./Friends";
import Groups from "./groups/Groups";
import Profile from "./Profile";

const navItems = ["Profile", "Friends", "Groups"];

const ChatActivities = () => {
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [isFriendsActive, setIsFriendsActive] = useState(false);
  const [isGroupsActive, setIsGroupsActive] = useState(false);

  const [activeNavItem, setActiveNavItem] = useState(
    JSON.parse(localStorage.getItem("activeNavItem") || "Profile")
  );

  const navigationHandler = (item: string) => {
    item === "Profile"
      ? (setIsProfileActive(true),
        localStorage.setItem("activeNavItem", JSON.stringify(item)))
      : setIsProfileActive(false);
    item === "Friends"
      ? (setIsFriendsActive(true),
        localStorage.setItem("activeNavItem", JSON.stringify(item)))
      : setIsFriendsActive(false);
    item === "Groups"
      ? (setIsGroupsActive(true),
        localStorage.setItem("activeNavItem", JSON.stringify(item)))
      : setIsGroupsActive(false);
  };

  useEffect(() => {
    setActiveNavItem(
      JSON.parse(localStorage.getItem("activeNavItem") || "Profile")
    );
  }, [navigationHandler]);

  useEffect(() => {
    activeNavItem === "Profile"
      ? setIsProfileActive(true)
      : setIsProfileActive(false);
    activeNavItem === "Friends"
      ? setIsFriendsActive(true)
      : setIsFriendsActive(false);
    activeNavItem === "Groups"
      ? setIsGroupsActive(true)
      : setIsGroupsActive(false);
  });

  return (
    <div className="chat-activities">
      <div className="navigation">
        <div className="logo">
          <Link to={"/"}>
            <h1>LOGO</h1>
          </Link>
        </div>
        <nav>
          {navItems.map((item) => (
            <h3
              key={item}
              className={
                item === activeNavItem ? "nav-item-active" : "nav-item"
              }
              onClick={() => navigationHandler(item)}
            >
              {item}
            </h3>
          ))}
        </nav>
      </div>
      {isFriendsActive && <Friends isActive={isFriendsActive} />}
      {isProfileActive && <Profile />}
      {isGroupsActive && <Groups isActive={isGroupsActive} />}
    </div>
  );
};

export default ChatActivities;
