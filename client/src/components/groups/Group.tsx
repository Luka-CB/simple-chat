import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GroupContext, groupsIFace } from "../../context/features/group";
import DummyGroupPic from "../../assets/images/dummy-group-pic.png";
import DummyProfilePic from "../../assets/images/dummy-profile-pic.png";
import {
  AiOutlineEdit,
  AiOutlineCloseCircle,
  AiOutlineUserAdd,
  AiOutlineDelete,
} from "react-icons/ai";
import GroupRequests from "./GroupRequests";
import AddGroupFriends from "./AddGroupFriends";
import { AuthContext } from "../../context/features/auth";
import { SocketContext } from "../../context/features/socket";
import { StateContext } from "../../context/features/states";
import UploadImage from "../UploadImage";
import UpdateGroupName from "./UpdateGroupName";
import DeleteModal from "../DeleteModal";

interface groupPropsIFace {
  groups: groupsIFace[];
  hideGroup: () => void;
}

const Group: React.FC<groupPropsIFace> = ({ groups, hideGroup }) => {
  const [showGroupRequests, setShowGroupRequests] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const [disableBtn, setDisableBtn] = useState(false);

  const {
    getGroup,
    group,
    groupMembers,
    removeMember,
    removeMemberSuccess,
    leaveGroup,
    leaveGroupLoading,
    leaveGroupSuccess,
    setUpdGroupNameSuccess,
  } = useContext(GroupContext);
  const { user } = useContext(AuthContext);
  const { usersOnline, groupsOnline } = useContext(SocketContext);
  const {
    showUploadImage,
    showUploadImageHandler,
    showUpdateGroupName,
    showUpdateGroupNameHandler,
    showDeleteModal,
    showDeleteModalHandler,
  } = useContext(StateContext);

  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");

  const navigate = useNavigate();

  useEffect(() => {
    if (groupId) getGroup(groupId);

    if (removeMemberSuccess) {
      setRemoveIndex(null);
      setDisableBtn(false);
    }

    if (!groupId) {
      hideGroup();
    }
  }, [groupId, removeMemberSuccess]);

  useEffect(() => {
    if (leaveGroupSuccess) {
      navigate("/chat");
      hideGroup();
    }
  }, [leaveGroupSuccess]);

  const removeMemberHandler = (userId: string, i: number) => {
    setRemoveIndex(i);
    setDisableBtn(true);
    if (groupId) removeMember(groupId, userId);
  };

  const groupsFormated = groups?.filter((group) => group._id !== groupId);
  const membersFormated = groupMembers?.filter(
    (member) => member._id !== group?.admin?._id
  );
  const isGroupAdmin = group?.admin?._id === user?.id;

  return (
    <div className="group-container">
      <div className="group-profile">
        <AiOutlineCloseCircle id="close-icon" onClick={hideGroup} />
        <div className="image-wrapper">
          <div className="image">
            {group?.image ? (
              <img src={group.image} alt={group.name} />
            ) : (
              <img src={DummyGroupPic} alt="Dummy Group Picture" />
            )}
          </div>
          {isGroupAdmin && (
            <span id="upload-link" onClick={() => showUploadImageHandler(true)}>
              {group.image ? "Update Image" : "Upload image"}
            </span>
          )}
        </div>
        <section>
          <div className="info">
            <div id="name">
              <h3>
                {group.name?.length > 26
                  ? group.name?.substring(0, 26) + "..."
                  : group.name}
              </h3>
              {isGroupAdmin && (
                <AiOutlineEdit
                  id="edit-icon"
                  onClick={() => {
                    setUpdGroupNameSuccess(false);
                    showUpdateGroupNameHandler(true);
                  }}
                />
              )}
            </div>
            <p id="date">Created {group.createdAt} ago</p>
            <h6 id="admin">
              Admin: <span>{group.admin?.username}</span>
            </h6>
          </div>
          {isGroupAdmin && (
            <div className="activity">
              <div
                className="requests"
                onClick={() => setShowGroupRequests(true)}
              >
                <span>Requests</span>
                <div id="pill">{group.requests?.length}</div>
              </div>

              <div
                className="add-friend"
                onClick={() => setShowAddFriend(true)}
              >
                <AiOutlineUserAdd id="add-icon" />
                <span>Add Friend</span>
              </div>

              <div
                className="del-group"
                onClick={() => showDeleteModalHandler(true)}
              >
                <AiOutlineDelete id="del-icon" />
                <span>Delete Group</span>
              </div>
            </div>
          )}
        </section>
      </div>
      <hr />
      <div className="section-two">
        <div
          className={groupsFormated.length === 0 ? "col-one-empty" : "col-one"}
          style={{
            borderTopRightRadius: groupsFormated?.length < 6 ? "20px" : "unset",
          }}
        >
          <div
            className="groups-wrapper"
            style={{
              overflowY: groupsFormated?.length > 6 ? "scroll" : "initial",
            }}
          >
            {groupsFormated?.map((group) => {
              const isGroupOnline = groupsOnline?.some(
                (groupOnline) => groupOnline.id === group._id
              );

              return (
                <div className="group" key={group._id}>
                  <h5
                    onClick={() =>
                      navigate({
                        pathname: "/chat",
                        search: `?groupId=${group._id}`,
                      })
                    }
                    id="group-name"
                    title={group.name}
                  >
                    {group.name.substring(0, 12)}...
                  </h5>
                  <div id="image">
                    {group.image ? (
                      <img src={group.image} alt={group.name} />
                    ) : (
                      <img src={DummyGroupPic} alt="dimmy pic" />
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
        <div className="col-two">
          <div
            className="members-wrapper"
            style={{
              overflowY: groupMembers?.length > 7 ? "scroll" : "initial",
            }}
          >
            <div id="member-count">Members: {groupMembers?.length}</div>
            <div className="members">
              {membersFormated?.map((member, i) => {
                const isUserOnline = usersOnline?.some(
                  (user) => user.userId === member._id
                );

                return (
                  <div className="member" key={member._id}>
                    <div id="avatar">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.username} />
                      ) : (
                        <img src={DummyProfilePic} alt="dummy pic" />
                      )}
                      <h5 id="user-name">{member.username}</h5>
                      {isUserOnline ? (
                        <div id="online"></div>
                      ) : (
                        <div id="offline"></div>
                      )}
                    </div>
                    {member._id === user?.id && (
                      <button
                        onClick={() => groupId && leaveGroup(groupId)}
                        id="leave-btn"
                      >
                        {leaveGroupLoading ? "...." : "Leave Group"}
                      </button>
                    )}
                    {group?.admin?._id === user?.id && (
                      <button
                        onClick={() => removeMemberHandler(member._id, i)}
                        id="remove-btn"
                        disabled={disableBtn}
                      >
                        {removeIndex === i ? "...." : "Remove"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {showGroupRequests && (
        <GroupRequests
          showModal={showGroupRequests}
          hideModal={() => {
            setShowGroupRequests(false);
            if (groupId) getGroup(groupId);
          }}
          groupId={groupId}
        />
      )}
      {showAddFriend && (
        <AddGroupFriends
          showModal={showAddFriend}
          hideModal={() => {
            setShowAddFriend(false);
          }}
          groupId={groupId}
        />
      )}
      {showUploadImage && (
        <UploadImage
          avatar={group?.image}
          type={"group"}
          groupId={group._id}
          upload_preset={"simple-chat-group-image"}
        />
      )}
      {showUpdateGroupName && (
        <UpdateGroupName groupName={group.name} groupId={group._id} />
      )}
      {showDeleteModal && (
        <DeleteModal
          text="Are you sure? You are deleting"
          textBold={group.name}
        />
      )}
    </div>
  );
};

export default Group;
