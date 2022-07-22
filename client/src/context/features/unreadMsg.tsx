import { createContext, ReactNode, useState } from "react";
import axios from "axios";

interface childrenIFace {
  children: ReactNode;
}

interface unreadMsgsIFace {
  message: string;
  senderId: string;
  recieverId: string | undefined;
}

interface unreadMsgContextIFace {
  dataBaseUnreadMsgs: unreadMsgsIFace[];
  createUnreadMsg: (msgData: unreadMsgsIFace) => void;
  fetchUnreadMsgs: () => void;
  removeUnreadMsgs: (senderId: string) => void;
  crUnreadMsgSuccess: boolean;
}

export const UnreadMsgContext = createContext({} as unreadMsgContextIFace);

const UnreadMsgProvider = ({ children }: childrenIFace) => {
  const [dataBaseUnreadMsgs, setDataBaseUnreadMsgs] = useState<
    unreadMsgsIFace[]
  >([]);
  const [crUnreadMsgSuccess, setCrUnreadMsgSuccess] = useState(false);

  const createUnreadMsg = async (msgData: unreadMsgsIFace) => {
    setCrUnreadMsgSuccess(false);

    try {
      const { data } = await axios.post("/api/unreadmsgs/create", msgData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (data) setCrUnreadMsgSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUnreadMsgs = async () => {
    try {
      const { data } = await axios.get("/api/unreadmsgs/fetch", {
        withCredentials: true,
      });

      if (data) setDataBaseUnreadMsgs(data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeUnreadMsgs = async (senderId: string) => {
    try {
      await axios.delete(`/api/unreadmsgs/remove/${senderId}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const contextData = {
    dataBaseUnreadMsgs,
    createUnreadMsg,
    fetchUnreadMsgs,
    crUnreadMsgSuccess,
    removeUnreadMsgs,
  };

  return (
    <UnreadMsgContext.Provider value={contextData}>
      {children}
    </UnreadMsgContext.Provider>
  );
};

export default UnreadMsgProvider;
