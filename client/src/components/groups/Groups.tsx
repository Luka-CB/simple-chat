import { useContext, useEffect, useState } from "react";
import { HiSearchCircle } from "react-icons/hi";
import {
  AiOutlineUsergroupAdd,
  AiOutlineUsergroupDelete,
  AiOutlineCheck,
} from "react-icons/ai";
import DummyGroupPic from "../../assets/images/dummy-group-pic.png";
import { propsIFace } from "../Profile";
import { GroupContext } from "../../context/features/group";
import { useNavigate } from "react-router-dom";
import Group from "./Group";
import { ReqContext } from "../../context/features/request";
import { AuthContext } from "../../context/features/auth";
import { SocketContext } from "../../context/features/socket";
import { StateContext } from "../../context/features/states";

const Groups: React.FC<propsIFace> = ({ isActive }) => {
  const {
    crGroupLoading,
    crGroupSuccess,
    createGroup,
    getGroups,
    groups,
    groupCount,
    getGroupsLoading,
    searchGroups,
    searchedGroups,
    searchedGroupsCount,
  } = useContext(GroupContext);

  const { sendGroupRequest, sendReqSuccess } = useContext(ReqContext);

  const { user } = useContext(AuthContext);

  const { groupsOnline } = useContext(SocketContext);

  const { showGroup, showGroupHandler } = useContext(StateContext);

  const [groupName, setGroupName] = useState("");
  const [query, setQuery] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [reqIndex, setReqIndex] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (crGroupSuccess || isActive) {
      setGroupName("");
      getGroups();
    }
  }, [crGroupSuccess, isActive]);

  const createGroupHandler = () => {
    if (groupName) {
      createGroup(groupName);
    }
  };

  useEffect(() => {
    if (query) {
      setShowSearchResult(true);
    }

    const timeOut = setTimeout(() => {
      if (query) {
        searchGroups(query);
      }
    }, 300);

    return () => clearTimeout(timeOut);
  }, [query]);

  useEffect(() => {
    if (sendReqSuccess) {
      setReqIndex(null);
      searchGroups(query);
    }
  }, [sendReqSuccess]);

  const sendRequestHandler = (groupId: string, i: number) => {
    setReqIndex(i);
    sendGroupRequest(groupId);
  };

  return (
    <div
      className="groups-container"
      onClick={() => {
        setShowSearchResult(false);
        setQuery("");
      }}
    >
      <div className="create-group">
        <input
          type="text"
          placeholder="Enter Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createGroupHandler()}
        />
        <button
          onClick={createGroupHandler}
          id={groupName ? "cr-btn" : "cr-btn-disabled"}
        >
          {crGroupLoading ? "Creating..." : "Create"}
        </button>
      </div>
      <div className="groups-section">
        <div id="gr-count">Groups: {groupCount}</div>
        <div className="groups-wrapper">
          <div className="search-group" onClick={(e) => e.stopPropagation()}>
            <HiSearchCircle id="search-icon" />
            <input
              type="text"
              placeholder="search for groups"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {showSearchResult && (
              <div className="search-res">
                <div className="result-wrapper">
                  <p id="result-count">
                    Result: <span>{searchedGroupsCount}</span>
                  </p>
                  {/* {searchLoading && <p>Loading...</p>} */}
                  {searchedGroupsCount === 0 && <p id="no-match">No Match!</p>}
                  {searchedGroups?.map((group, i) => {
                    const isReqSent = group.requests?.some(
                      (req) => req.from === user.id
                    );

                    return (
                      <div className="result" key={group._id}>
                        <div className="image">
                          {group.image ? (
                            <img src={group.image} alt="group pic" />
                          ) : (
                            <img src={DummyGroupPic} alt="dummy pic" />
                          )}
                        </div>
                        <div className="info">
                          <h6 id="name" title={group.name}>
                            {group.name.length > 17
                              ? group.name.substring(0, 17) + "..."
                              : group.name}
                          </h6>
                          <h6 id="count">members: {group.members?.length}</h6>
                          <button
                            id={isReqSent ? "sent-btn" : "join-btn"}
                            onClick={() => sendRequestHandler(group._id, i)}
                          >
                            {reqIndex === i ? (
                              <span>....</span>
                            ) : isReqSent ? (
                              <>
                                <AiOutlineCheck id="check-icon" />
                                <span>Unsend</span>
                              </>
                            ) : (
                              <>
                                <AiOutlineUsergroupAdd id="join-icon" />
                                <span>Join</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div
            className="groups"
            style={{
              overflowY: groupCount > 7 ? "scroll" : "initial",
            }}
          >
            {groups?.length === 0 && <p id="no-groups">No Groups!</p>}
            {getGroupsLoading && <p>Loading...</p>}
            {groups?.map((group) => {
              const isGroupOnline = groupsOnline?.some(
                (groupOnline) => groupOnline.id === group._id
              );

              return (
                <div
                  key={group._id}
                  className="group"
                  onClick={() => {
                    navigate({
                      pathname: "/chat",
                      search: `?groupId=${group._id}`,
                    });
                    showGroupHandler(true);
                  }}
                >
                  <div className="info">
                    <h5 id="group-name">{group.name}</h5>
                    <h6 id="members">Members: {group.members?.length}</h6>
                  </div>
                  <div className="image">
                    {group.image ? (
                      <img src={group.image} alt={group.name} />
                    ) : (
                      <img src={DummyGroupPic} alt="Dummy Group Picture" />
                    )}
                    {isGroupOnline ? (
                      <div id="online"></div>
                    ) : (
                      <div id="offline"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showGroup && (
        <Group groups={groups} hideGroup={() => showGroupHandler(false)} />
      )}
    </div>
  );
};

export default Groups;
