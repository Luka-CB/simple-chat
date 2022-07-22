import axios from "axios";
import { createContext, ReactNode, useState } from "react";

interface childrenIFace {
  children: ReactNode;
}

interface messagesIFace {
  _id: string;
  author: string;
  message: string;
  date: string;
}

interface chatIFace {
  _id: string;
}

interface chatContextIFace {
  chatId: string;
  setChatId: any;
  getChat: (chatId: string) => void;
  getChatLoading: boolean;
}

export const ChatContext = createContext({} as chatContextIFace);

const ChatProvider = ({ children }: childrenIFace) => {
  const [chatId, setChatId] = useState("");

  const [getChatLoading, setGetChatLoading] = useState(false);

  const getChat = async (userId: string) => {
    try {
      const { data } = await axios.get(`/api/chats/fetch?userId=${userId}`, {
        withCredentials: true,
      });

      if (data) {
        setChatId(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contextData = {
    getChat,
    chatId,
    setChatId,
    getChatLoading,
  };

  return (
    <ChatContext.Provider value={contextData}>{children}</ChatContext.Provider>
  );
};

export default ChatProvider;
