import axios from "axios";
import { createContext, ReactNode, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface childrenIFace {
  children: ReactNode;
}

interface friendIFace {
  _id: string;
  username: string;
  avatar: string;
}

interface friendContextIFace {
  friends: friendIFace[];
  friendCount: number;
  getFriends: () => void;
  unfriend: (friendId: string) => void;
  getFriendsLoading: boolean;
  unfrSuccess: boolean;
}

export const FriendContext = createContext({} as friendContextIFace);

const FriendProvider = ({ children }: childrenIFace) => {
  const [friends, setFriends] = useState<friendIFace[]>([]);
  const [friendCount, setFriendCount] = useState(0);
  const [getFriendsLoading, setGetFriendsLoading] = useState(false);

  const [unfrSuccess, setUnfrSuccess] = useState(false);

  const getFriends = async () => {
    try {
      setGetFriendsLoading(true);

      const { data } = await axios.get("/api/friends/fetch-all", {
        withCredentials: true,
      });

      if (data) {
        setGetFriendsLoading(false);
        setFriends(data.friends);
        setFriendCount(data.count);
      }
    } catch (error) {
      setGetFriendsLoading(false);
      console.log(error);
    }
  };

  const unfriend = async (friendId: string) => {
    setUnfrSuccess(false);

    try {
      const { data } = await axios.put(
        `/api/friends/remove/${friendId}`,
        {},
        { withCredentials: true }
      );

      if (data) {
        setUnfrSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contextData = {
    getFriends,
    friends,
    friendCount,
    getFriendsLoading,
    unfriend,
    unfrSuccess,
  };

  return (
    <FriendContext.Provider value={contextData}>
      {children}
    </FriendContext.Provider>
  );
};

export default FriendProvider;
