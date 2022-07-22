import { createContext, ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface childrenIFace {
  children: ReactNode;
}

interface chatWindowStateIFace {
  userId: string;
  active: boolean;
}

interface stateContextIFace {
  showGroupHandler: (value: boolean) => void;
  showUploadImageHandler: (value: boolean) => void;
  showUpdateGroupNameHandler: (value: boolean) => void;
  showDeleteModalHandler: (value: boolean) => void;
  showChatWindowHandler: (value: boolean, userId: string) => void;
  showGroup: boolean;
  showUploadImage: boolean;
  showUpdateGroupName: boolean;
  showDeleteModal: boolean;
  showChatWindow: boolean;
  chat: chatWindowStateIFace;
}

export const StateContext = createContext({} as stateContextIFace);

const StateProvider = ({ children }: childrenIFace) => {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [showUpdateGroupName, setShowUpdateGroupName] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chat, setChat] = useState({} as chatWindowStateIFace);

  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
  const chatId = searchParams.get("chatId");

  useEffect(() => {
    if (groupId) setShowGroup(true);
  }, [groupId]);

  useEffect(() => {
    if (localStorage.getItem("chat")) {
      setChat(JSON.parse(localStorage.getItem("chat") || ""));
    }
  }, []);

  const showChatWindowHandler = (value: boolean, userId: string = "") => {
    setShowChatWindow(value);
    if (chatId)
      localStorage.setItem(
        "chat",
        JSON.stringify({
          userId,
          active: value,
        })
      );
  };

  const showGroupHandler = (value: boolean) => setShowGroup(value);

  const showUploadImageHandler = (value: boolean) => setShowUploadImage(value);

  const showUpdateGroupNameHandler = (value: boolean) =>
    setShowUpdateGroupName(value);

  const showDeleteModalHandler = (value: boolean) => setShowDeleteModal(value);

  const contextData = {
    showGroupHandler,
    showGroup,
    showUploadImageHandler,
    showUploadImage,
    showUpdateGroupNameHandler,
    showUpdateGroupName,
    showDeleteModalHandler,
    showDeleteModal,
    showChatWindowHandler,
    showChatWindow,
    chat,
  };

  return (
    <StateContext.Provider value={contextData}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
