import axios from "axios";
import { createContext, ReactNode, useState, useContext } from "react";
import { SocketContext } from "./socket";

interface childrenIFace {
  children: ReactNode;
}

export interface messagesIFace {
  _id?: string;
  author: {
    _id: string;
    username: string;
  };
  message: string;
  date: Date;
}

interface msgDataIFace {
  message: string;
  date: Date;
  chatId?: string | null;
  senderId: string;
  senderName: string;
  receiverId?: string;
}

interface groupMsgDataIFace {
  message: string;
  date: Date;
  groupId: string | null;
  senderId: string;
  senderName: string;
  // receiverId?: string;
}

interface userIdsIFace {
  _id: string;
  username: string;
}

interface messageContextIFace {
  messages: messagesIFace[];
  groupMessages: messagesIFace[];
  sentMsg: messagesIFace | null;
  setMessages: any;
  setGroupMessages: any;
  setSentMsg: any;
  userIds: userIdsIFace[];
  createMessage: (msgData: msgDataIFace) => void;
  createGroupMessage: (msgData: groupMsgDataIFace) => void;
  getMessages: (chatId: string) => void;
  getGroupMessages: (groupId: string) => void;
  createMsgSuccess: boolean;
  getMsgLoading: boolean;
}

export const MessageContext = createContext({} as messageContextIFace);

const MessageProvider = ({ children }: childrenIFace) => {
  const { socket } = useContext(SocketContext);

  const [messages, setMessages] = useState<messagesIFace[]>([]);
  const [groupMessages, setGroupMessages] = useState<messagesIFace[]>([]);
  const [sentMsg, setSentMsg] = useState<messagesIFace | null>(null);
  const [userIds, setUserIds] = useState<userIdsIFace[]>([]);
  const [createMsgSuccess, setCreateMsgSuccess] = useState(false);
  const [getMsgLoading, setGetMsgLoading] = useState(false);

  const createMessage = async (msgData: msgDataIFace) => {
    setCreateMsgSuccess(false);

    if (msgData.receiverId) {
      await socket?.emit("sendMessage", {
        message: msgData.message,
        senderId: msgData.senderId,
        receiverId: msgData.receiverId,
        senderName: msgData.senderName,
      });
    }

    setSentMsg({
      author: { _id: msgData.senderId, username: msgData.senderName },
      date: new Date(),
      message: msgData.message,
    });

    try {
      const { data } = await axios.post(
        "/api/messages/create",
        {
          message: msgData.message,
          date: msgData.date,
          chatId: msgData.chatId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data) {
        setCreateMsgSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createGroupMessage = async (msgData: groupMsgDataIFace) => {
    setCreateMsgSuccess(false);

    await socket?.emit("sendGroupMessage", {
      author: { _id: msgData.senderId, username: msgData.senderName },
      message: msgData.message,
      groupId: msgData.groupId,
    });

    if (!msgData.groupId) {
      setSentMsg({
        author: { _id: msgData.senderId, username: msgData.senderName },
        date: new Date(),
        message: msgData.message,
      });
    }

    try {
      const { data } = await axios.post(
        "/api/messages/create-group-message",
        {
          message: msgData.message,
          date: msgData.date,
          groupId: msgData.groupId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data) {
        setCreateMsgSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async (chatId: string) => {
    setGetMsgLoading(true);

    try {
      const { data } = await axios.get(`/api/messages/fetch/${chatId}`, {
        withCredentials: true,
      });

      if (data) {
        setGetMsgLoading(false);
        setMessages(data.messages);
        setUserIds(data.userIds);
      }
    } catch (error) {
      setGetMsgLoading(false);
      console.log(error);
    }
  };

  const getGroupMessages = async (groupId: string) => {
    setGetMsgLoading(true);

    try {
      const { data } = await axios.get(
        `/api/messages/fetch-group-messages/${groupId}`,
        {
          withCredentials: true,
        }
      );

      if (data) {
        setGetMsgLoading(false);
        setGroupMessages(data);
      }
    } catch (error) {
      setGetMsgLoading(false);
      console.log(error);
    }
  };

  const contextData = {
    messages,
    setMessages,
    groupMessages,
    setGroupMessages,
    userIds,
    createMessage,
    createGroupMessage,
    getMessages,
    getGroupMessages,
    getMsgLoading,
    createMsgSuccess,
    sentMsg,
    setSentMsg,
  };

  return (
    <MessageContext.Provider value={contextData}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
