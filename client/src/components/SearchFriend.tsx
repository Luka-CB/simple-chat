import { useCallback, useContext, useEffect, useState } from "react";
import {
  FaSearch,
  FaUserPlus,
  FaUserMinus,
  FaTimesCircle,
  FaUserFriends,
} from "react-icons/fa";
import DummyProfilePic from "../assets/images/dummy-profile-pic.png";
import { ReqContext } from "../context/features/request";
import { UserContext } from "../context/features/users";

const SearchFriend = () => {
  const [query, setQuery] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { searchResult, getSearchUsers, searchLoading, searchResCount } =
    useContext(UserContext);

  const { crReqSuccess, createRequest } = useContext(ReqContext);

  useEffect(() => {
    if (query) {
      setShowSearchResult(true);
    }

    const timeOut = setTimeout(() => {
      if (query) {
        getSearchUsers(query);
      }
    }, 500);

    return () => clearTimeout(timeOut);
  }, [query]);

  useEffect(() => {
    if (crReqSuccess) {
      getSearchUsers(query);
    }
  }, [crReqSuccess]);

  return (
    <div className="search">
      <div className="search-input">
        <input
          type="text"
          placeholder="Search for friends"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="search-btn">
          <FaSearch />
        </div>
      </div>

      {showSearchResult && (
        <div className="search-result-window">
          <div className="header">
            <h3 className="found">
              Found: <address>{searchResCount}</address>
            </h3>
            <FaTimesCircle
              onClick={() => {
                setShowSearchResult(false);
                setQuery("");
              }}
              className="close"
            />
          </div>
          <hr />
          <div className="result">
            {searchLoading && <p>Loading...</p>}
            {searchResult?.map((user) => (
              <div className="user" key={user._id}>
                <div className="info">
                  {user.avatar ? (
                    <img src={user.avatar} alt="User Avatar" />
                  ) : (
                    <img src={DummyProfilePic} alt="Dummy Profile Picture" />
                  )}
                  <h3 className="username">{user.username}</h3>
                </div>
                <div className="actions">
                  {user.isFriend ? (
                    <div className="friends-btn">
                      <FaUserFriends className="icon" />
                      <span>Friend</span>
                    </div>
                  ) : user.hasSentRequest ? (
                    <div className="already-sent-btn">Sent Request</div>
                  ) : (
                    <div
                      onClick={() => createRequest(user._id)}
                      className="add-btn"
                    >
                      {user.hasRequest ? (
                        <>
                          <FaUserMinus className="icon" />
                          <span>Request Sent</span>
                        </>
                      ) : (
                        <>
                          <FaUserPlus className="icon" />
                          <span>Add Friend</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFriend;
