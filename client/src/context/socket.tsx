import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "./auth";
import { messagesIFace } from "./message";
import { useSearchParams } from "react-router-dom";

interface childrenIFace {
  children: ReactNode;
}

interface usersOnlineIFace {
  userId: string;
  socketId: string;
}

interface socketContextIFace {
  socket: Socket | any;
  usersOnline: usersOnlineIFace[];
  groupsOnline: { id: string }[];
  liveMessages: messagesIFace | null;
  setLiveMessages: any;
  liveGroupMessages: messagesIFace | null;
  setLiveGroupMessages: any;
}

export const SocketContext = createContext({} as socketContextIFace);

const SocketProvider = ({ children }: childrenIFace) => {
  const [socket, setSocket] = useState<Socket>();
  const [usersOnline, setUsersOnline] = useState<usersOnlineIFace[]>([]);
  const [groupsOnline, setGroupsOnline] = useState<{ id: string }[]>([]);
  const [liveMessages, setLiveMessages] = useState<messagesIFace | null>(null);
  const [liveGroupMessages, setLiveGroupMessages] =
    useState<messagesIFace | null>(null);

  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    socket?.emit("addUser", user.id);
    socket?.on("getUsers", (users: any) => {
      setUsersOnline(users);
    });

    if (groupId) {
      socket?.emit("addGroup", groupId);
    }

    socket?.on("getGroups", (groups) => {
      setGroupsOnline(groups);
    });
  }, [user, groupId]);

  useEffect(() => {
    socket?.on("getMessage", (data) => {
      setLiveMessages({
        author: { _id: data.senderId, username: data.senderName },
        date: new Date(),
        message: data.message,
      });
    });

    socket?.on("getGroupMessage", (data) => {
      setLiveGroupMessages({
        author: data.author,
        date: new Date(),
        message: data.message,
      });
    });
  }, [socket]);

  const contextData = {
    socket,
    usersOnline,
    groupsOnline,
    liveMessages,
    setLiveMessages,
    liveGroupMessages,
    setLiveGroupMessages,
  };

  return (
    <SocketContext.Provider value={contextData}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
