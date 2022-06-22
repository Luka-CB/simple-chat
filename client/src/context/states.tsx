import { createContext, ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface childrenIFace {
  children: ReactNode;
}

interface stateContextIFace {
  showGroupHandler: (value: boolean) => void;
  showUploadImageHandler: (value: boolean) => void;
  showUpdateGroupNameHandler: (value: boolean) => void;
  showDeleteModalHandler: (value: boolean) => void;
  showGroup: boolean;
  showUploadImage: boolean;
  showUpdateGroupName: boolean;
  showDeleteModal: boolean;
}

export const StateContext = createContext({} as stateContextIFace);

const StateProvider = ({ children }: childrenIFace) => {
  const [showGroup, setShowGroup] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [showUpdateGroupName, setShowUpdateGroupName] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");

  useEffect(() => {
    if (groupId) setShowGroup(true);
  }, [groupId]);

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
  };

  return (
    <StateContext.Provider value={contextData}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
