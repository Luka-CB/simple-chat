import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { MessageContext } from "../context/features/message";
import { AuthContext } from "../context/features/auth";
import { formatDistanceToNow } from "date-fns";
import { SocketContext } from "../context/features/socket";
import { v4 as uuidv4 } from "uuid";
import ScrollToBottom from "react-scroll-to-bottom";
import Picker from "emoji-picker-react";
import { ChatContext } from "../context/features/chat";
import { StateContext } from "../context/features/states";
import { UnreadMsgContext } from "../context/features/unreadMsg";

const ChatWindow = () => {
  const [msgText, setMsgText] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState<any>(null);
  const [showEmojiWindow, setShowEmojiWindow] = useState(false);

  const onEmojiClick = (event: any, emojiObject: any) => {
    setChosenEmoji(emojiObject);
  };

  const { user } = useContext(AuthContext);
  const {
    showUpdateGroupNameHandler,
    showChatWindow,
    showChatWindowHandler,
    chat,
  } = useContext(StateContext);

  const {
    liveMessages,
    setLiveMessages,
    liveGroupMessages,
    setLiveGroupMessages,
    usersOnline,
    socket,
  } = useContext(SocketContext);

  const {
    createMessage,
    createGroupMessage,
    getMessages,
    getGroupMessages,
    messages,
    groupMessages,
    sentMsg,
    setMessages,
    setGroupMessages,
    setSentMsg,
    userIds,
  } = useContext(MessageContext);

  const { setChatId } = useContext(ChatContext);

  const { createUnreadMsg } = useContext(UnreadMsgContext);

  const [searchParams] = useSearchParams();

  const chatId = searchParams.get("chatId");
  const groupId = searchParams.get("groupId");

  const navigate = useNavigate();

  useEffect(() => {
    if (chatId) {
      showChatWindowHandler(true, user.id);
      getMessages(chatId);
      socket?.emit("updateWindowState", user.id, chatId);
    }

    if (groupId) {
      showChatWindowHandler(true, "");
      getGroupMessages(groupId);
    }
  }, [chatId, groupId, socket]);

  useEffect(() => {
    if (chosenEmoji) {
      setMsgText(msgText + chosenEmoji?.emoji);
    }
  }, [chosenEmoji]);

  useEffect(() => {
    if (liveMessages) {
      setMessages((prev: any) => [...prev, liveMessages]);
      setLiveMessages(null);
    }
    if (sentMsg && chatId) {
      setMessages((prev: any) => [...prev, sentMsg]);
      setSentMsg(null);
      setMsgText("");
    }

    if (liveGroupMessages) {
      setGroupMessages((prev: any) => [...prev, liveGroupMessages]);
      setLiveGroupMessages(null);
    }
  }, [liveMessages, liveGroupMessages, sentMsg, chatId]);

  const createMsgHandler = () => {
    let receiver = userIds.find((userId) => user.id !== userId._id);
    const onlineUser = usersOnline?.find(
      (user) => user.userId === receiver?._id
    );

    const isChatOpen = usersOnline?.some(
      (userOnline) =>
        userOnline.userId === receiver?._id &&
        userOnline.chatWindow.chatId === chatId
    );
    console.log(isChatOpen);

    const msgData = {
      message: msgText,
      date: new Date(),
      chatId,
      senderId: user.id,
      receiverId: onlineUser?.userId || "",
      senderName: user?.username,
    };

    if (!msgText) alert("please provide message!");

    createMessage(msgData);

    if (!isChatOpen && msgData.receiverId) {
      createUnreadMsg({
        message: msgData.message,
        senderId: msgData.senderId,
        recieverId: msgData.receiverId,
      });

      socket?.emit("sendUnreadMessage", {
        message: msgData.message,
        senderId: msgData.senderId,
        receiverId: msgData.receiverId,
      });
    }
  };

  const createGroupMsgHandler = () => {
    const msgData = {
      message: msgText,
      date: new Date(),
      groupId,
      senderId: user.id,
      senderName: user?.username,
    };

    if (!msgText) alert("please provide message!");

    createGroupMessage(msgData);

    setMsgText("");
  };

  const chatToggleHandler = () => {
    socket?.emit("closeChat", groupId);
    socket?.emit("updateWindowState", user.id);

    showChatWindowHandler(false, "");
    setChatId("");
    showUpdateGroupNameHandler(false);
    navigate({
      pathname: "/chat",
      search: ``,
    });
  };

  return (
    <div className="chat-window" onClick={() => setShowEmojiWindow(false)}>
      {showChatWindow ? (
        <>
          <div className="chat-area">
            <div onClick={chatToggleHandler} className="close-chat">
              <AiOutlineClose id="close-icon" />
              <span>close chat</span>
            </div>
            <ScrollToBottom className="scroll-wrapper">
              <div className="msg-wrapper">
                {chatId && messages?.length === 0 && (
                  <p id="no-msgs">No messages!</p>
                )}
                {groupId && groupMessages?.length === 0 && (
                  <p id="no-msgs">No messages!</p>
                )}
                {chatId
                  ? messages?.map((msg, i) => {
                      const isMyMsg = msg.author._id === user.id ? true : false;
                      const date = formatDistanceToNow(new Date(msg.date));
                      return (
                        <div
                          key={msg._id ? msg._id : uuidv4()}
                          className={isMyMsg ? "myMsg" : "msg"}
                        >
                          <div className="msg-text">
                            <p>
                              {msg.message} {isMyMsg}
                            </p>
                          </div>
                          <div className="info">
                            <h5>{date} ago</h5>
                            <h5>by: {msg.author.username}</h5>
                          </div>
                        </div>
                      );
                    })
                  : groupMessages?.map((msg) => {
                      const isMyMsg = msg.author._id === user.id ? true : false;
                      const date = formatDistanceToNow(new Date(msg.date));
                      return (
                        <div
                          key={msg._id ? msg._id : uuidv4()}
                          className={isMyMsg ? "myMsg" : "msg"}
                        >
                          <div className="msg-text">
                            <p>
                              {msg.message} {isMyMsg}
                            </p>
                          </div>
                          <div className="info">
                            <h5>{date} ago</h5>
                            <h5>by: {msg.author.username}</h5>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </ScrollToBottom>
          </div>
          <div className="input-area">
            <div className="chat-input" onClick={(e) => e.stopPropagation()}>
              <textarea
                placeholder="write text here"
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                // onKeyDown={(e) => e.key === "Enter" && createMsgHandler()}
              ></textarea>
              <div
                onClick={() => setShowEmojiWindow(true)}
                className="emoji-btn"
              >
                <BsEmojiSmile />
              </div>
              <div
                onClick={chatId ? createMsgHandler : createGroupMsgHandler}
                className="send-btn"
              >
                <FiSend />
              </div>
            </div>
            {showEmojiWindow && (
              <div
                className="emoji-window"
                onClick={(e) => e.stopPropagation()}
              >
                {chosenEmoji ? (
                  <span>You chose: {chosenEmoji.emoji}</span>
                ) : (
                  <span>No emoji Chosen</span>
                )}
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="chat-info">
          <h1>Choose Friend or group to start chat.</h1>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
