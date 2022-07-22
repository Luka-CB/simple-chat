import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DummyProfilePic from "../assets/images/dummy-profile-pic.png";
import { ChatContext } from "../context/features/chat";
import { FriendContext } from "../context/features/friend";
import { SocketContext } from "../context/features/socket";
import { UnreadMsgContext } from "../context/features/unreadMsg";
import { propsIFace } from "./Profile";
import SearchFriend from "./SearchFriend";

const Friends: React.FC<propsIFace> = ({ isActive }) => {
  const [frIndex, setFrIndex] = useState<number | null>(null);
  const [startChatIndex, setStartChatIndex] = useState<number | null>(null);

  const {
    friends,
    friendCount,
    getFriendsLoading,
    getFriends,
    unfriend,
    unfrSuccess,
  } = useContext(FriendContext);

  const { usersOnline, unreadMsgs, setUnreadMsgs } = useContext(SocketContext);
  const { getChat, chatId } = useContext(ChatContext);
  const { fetchUnreadMsgs, dataBaseUnreadMsgs, removeUnreadMsgs } =
    useContext(UnreadMsgContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (unfrSuccess) {
      setFrIndex(null);
    }

    getFriends();
  }, [isActive, unfrSuccess]);

  useEffect(() => {
    if (chatId) {
      setStartChatIndex(null);
      navigate({
        pathname: "/chat",
        search: `?chatId=${chatId}`,
      });
    }
  }, [chatId]);

  useEffect(() => {
    if (dataBaseUnreadMsgs) {
      setUnreadMsgs(dataBaseUnreadMsgs);
    }

    fetchUnreadMsgs();
  }, [dataBaseUnreadMsgs]);

  const unfriendHandler = (friendId: string, i: number) => {
    setFrIndex(i);
    unfriend(friendId);
  };

  const startChatHandler = (userId: string, i: number) => {
    const filteredUnreadMsgs = unreadMsgs.filter(
      (msg) => msg.senderId !== userId
    );
    setUnreadMsgs(filteredUnreadMsgs);
    removeUnreadMsgs(userId);

    setStartChatIndex(i);
    getChat(userId);
  };

  return (
    <div className="friends">
      <SearchFriend />
      <div className="count">
        <h4>Friends: {friendCount}</h4>
      </div>
      <div
        className="friends-wrapper"
        style={{
          overflowY: friends?.length > 7 ? "scroll" : "initial",
        }}
      >
        {getFriendsLoading && <p>Loading...</p>}
        {friendCount === 0 && <p id="no-friends">No Friends!</p>}
        {friends?.map((friend, i) => {
          const isOnline = usersOnline?.some(
            (user) => user.userId === friend._id
          );

          const unreadMsgCount = unreadMsgs.filter(
            (msg) => msg.senderId === friend._id
          );

          return (
            <div className="friend" key={friend._id}>
              <div className="col-1">
                <div className="image">
                  {friend.avatar ? (
                    <img src={friend.avatar} alt={friend.username} />
                  ) : (
                    <img src={DummyProfilePic} alt="Dummy Profile Picture" />
                  )}
                  {isOnline ? (
                    <div id="dot-online"></div>
                  ) : (
                    <div id="dot-offline"></div>
                  )}
                </div>
                <h3>{friend.username}</h3>
              </div>
              <div className="col-2">
                <button
                  onClick={() => unfriendHandler(friend._id, i)}
                  className="unfriend-btn"
                >
                  {frIndex === i ? "....." : "Unfriend"}
                </button>
                <div className="chat">
                  <button
                    onClick={() => startChatHandler(friend._id, i)}
                    className="start-chat-btn"
                  >
                    {startChatIndex === i ? "...." : "Chat"}
                  </button>
                  {unreadMsgs.length > 0 &&
                    unreadMsgs.some((msg) => msg.senderId === friend._id) && (
                      <div className="badge">
                        <span>{unreadMsgCount.length}</span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Friends;
