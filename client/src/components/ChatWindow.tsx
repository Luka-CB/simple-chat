import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { MessageContext, messagesIFace } from "../context/message";
import { AuthContext } from "../context/auth";
import { formatDistanceToNow } from "date-fns";
import { SocketContext } from "../context/socket";
import { v4 as uuidv4 } from "uuid";
import ScrollToBottom from "react-scroll-to-bottom";
import Picker from "emoji-picker-react";

const ChatWindow = () => {
  const [msgText, setMsgText] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState<any>(null);
  const [showEmojiWindow, setShowEmojiWindow] = useState(false);

  const { user } = useContext(AuthContext);
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

  const [searchParams] = useSearchParams();

  const chatId = searchParams.get("chatId");
  const groupId = searchParams.get("groupId");

  const navigate = useNavigate();

  useEffect(() => {
    if (chatId) {
      setShowChat(true);
      getMessages(chatId);
    }

    if (groupId) {
      setShowChat(true);
      getGroupMessages(groupId);
    }
  }, [chatId, groupId]);

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

  const onEmojiClick = (emojiObject: any) => {
    setChosenEmoji(emojiObject);
  };

  const chatToggleHandler = () => {
    socket?.emit("closeChat", groupId);

    setShowChat(false);
    navigate("/chat");
  };

  return (
    <div className='chat-window' onClick={() => setShowEmojiWindow(false)}>
      {showChat ? (
        <>
          <div className='chat-area'>
            <div onClick={chatToggleHandler} className='close-chat'>
              <AiOutlineClose id='close-icon' />
              <span>close chat</span>
            </div>
            <ScrollToBottom className='scroll-wrapper'>
              <div className='msg-wrapper'>
                {chatId && messages?.length === 0 && (
                  <p id='no-msgs'>No messages!</p>
                )}
                {groupId && groupMessages?.length === 0 && (
                  <p id='no-msgs'>No messages!</p>
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
                          <div className='msg-text'>
                            <p>
                              {msg.message} {isMyMsg}
                            </p>
                          </div>
                          <div className='info'>
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
                          <div className='msg-text'>
                            <p>
                              {msg.message} {isMyMsg}
                            </p>
                          </div>
                          <div className='info'>
                            <h5>{date} ago</h5>
                            <h5>by: {msg.author.username}</h5>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </ScrollToBottom>
          </div>
          <div className='input-area'>
            <div className='chat-input' onClick={(e) => e.stopPropagation()}>
              <textarea
                placeholder='write text here'
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                // onKeyDown={(e) => e.key === "Enter" && createMsgHandler()}
              ></textarea>
              <div
                onClick={() => setShowEmojiWindow(true)}
                className='emoji-btn'
              >
                <BsEmojiSmile />
              </div>
              <div
                onClick={chatId ? createMsgHandler : createGroupMsgHandler}
                className='send-btn'
              >
                <FiSend />
              </div>
            </div>
            {showEmojiWindow && (
              <div
                className='emoji-window'
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
        <div className='chat-info'>
          <h1>Choose Friend or group to start chat.</h1>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
