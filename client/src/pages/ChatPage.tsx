// import { io, Socket } from "socket.io-client";
import ChatActivities from "../components/ChatActivities";
import ChatWindow from "../components/ChatWindow";
import { useEffect, useState } from "react";

const ChatPage = () => {
  // const [socket, setSocket] = useState<Socket>();

  // useEffect(() => {
  //   setSocket(io("http://localhost:5000"));
  // }, []);

  return (
    <div className='chat-page-container'>
      <ChatActivities />
      <ChatWindow />
    </div>
  );
};

export default ChatPage;
