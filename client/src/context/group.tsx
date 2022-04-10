import axios from "axios";
import { createContext, ReactNode, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface childrenIFace {
  children: ReactNode;
}

export interface groupsIFace {
  _id: string;
  admin: {
    _id: string;
    username: string;
  };
  name: string;
  image?: string;
  members: string[];
  groupMessages: string[];
  requests: {
    _id: string;
    from: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface groupMembersIFace {
  _id: string;
  username: string;
  avatar: string;
}

interface searchedGroupsIFace {
  _id: string;
  admin: string;
  name: string;
  image?: string;
  members: string[];
  requests: {
    _id: string;
    from: string;
  }[];
}

interface groupContextIFace {
  createGroup: (name: string) => void;
  getGroups: () => void;
  getGroup: (groupId: string) => void;
  searchGroups: (q: string) => void;
  addMember: (groupId: string, userId: string) => void;
  removeMember: (groupId: string, userId: string) => void;
  leaveGroup: (groupId: string) => void;
  groups: groupsIFace[];
  group: groupsIFace;
  groupMembers: groupMembersIFace[];
  searchedGroups: searchedGroupsIFace[];
  groupCount: number;
  searchedGroupsCount: number;
  getGroupsLoading: boolean;
  getGroupLoading: boolean;
  crGroupLoading: boolean;
  crGroupSuccess: boolean;
  searchLoading: boolean;
  addMemberLoading: boolean;
  addMemberSuccess: boolean;
  removeMemberSuccess: boolean;
  leaveGroupLoading: boolean;
  leaveGroupSuccess: boolean;
}

export const GroupContext = createContext({} as groupContextIFace);

const GroupProvider = ({ children }: childrenIFace) => {
  const [groups, setGroups] = useState<groupsIFace[]>([]);
  const [groupCount, setGroupCount] = useState(0);
  const [getGroupsLoading, setGetGroupsLoading] = useState(false);
  const [crGroupLoading, setCrGroupLoading] = useState(false);
  const [crGroupSuccess, setCrGroupSuccess] = useState(false);
  const [getGroupLoading, setGroupLoading] = useState(false);
  const [group, setGroup] = useState({} as groupsIFace);
  const [groupMembers, setGroupMembers] = useState<groupMembersIFace[]>([]);
  const [searchedGroups, setSearchedGroups] = useState<searchedGroupsIFace[]>(
    []
  );
  const [searchedGroupsCount, setSearchedGroupsCount] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [addMemberSuccess, setAddMemberSuccess] = useState(false);
  const [removeMemberSuccess, setRemoveMemberSuccess] = useState(false);
  const [leaveGroupSuccess, setLeaveGroupSuccess] = useState(false);
  const [leaveGroupLoading, setLeaveGroupLoading] = useState(false);

  const createGroup = async (name: string) => {
    setCrGroupLoading(true);
    setCrGroupSuccess(false);

    try {
      const { data } = await axios.post(
        "/api/groups/create",
        { name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data) {
        setCrGroupLoading(false);
        setCrGroupSuccess(true);
      }
    } catch (error) {
      setCrGroupLoading(false);
      console.log(error);
    }
  };

  const getGroups = async () => {
    setGetGroupsLoading(true);

    try {
      const { data } = await axios.get("/api/groups/fetch", {
        withCredentials: true,
      });

      if (data) {
        setGetGroupsLoading(false);
        setGroups(data.groups);
        setGroupCount(data.count);
      }
    } catch (error) {
      setGetGroupsLoading(false);
      console.log(error);
    }
  };

  const getGroup = async (groupId: string) => {
    setGroupLoading(true);

    try {
      const { data } = await axios.get(`/api/groups/fetch-one/${groupId}`, {
        withCredentials: true,
      });

      if (data) {
        const groupFormated = {
          ...data.group,
          createdAt: formatDistanceToNow(new Date(data.group.createdAt)),
        };

        setGroupLoading(false);
        setGroup(groupFormated);
        setGroupMembers(data.members);
      }
    } catch (error) {
      setGroupLoading(false);
      console.log(error);
    }
  };

  const searchGroups = async (q: string) => {
    setSearchLoading(true);

    try {
      const { data } = await axios.get(`/api/groups/search?q=${q}`, {
        withCredentials: true,
      });

      if (data) {
        setSearchLoading(false);
        setSearchedGroups(data.groups);
        setSearchedGroupsCount(data.count);
      }
    } catch (error) {
      setSearchLoading(false);
      console.error(error);
    }
  };

  const addMember = async (groupId: string, userId: string) => {
    setAddMemberLoading(true);
    setAddMemberSuccess(false);

    try {
      const { data } = await axios.put(
        `/api/groups/add-member?groupId=${groupId}&userId=${userId}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data) {
        setAddMemberLoading(false);
        setAddMemberSuccess(true);
      }
    } catch (error) {
      setAddMemberLoading(false);
      console.error(error);
    }
  };

  const removeMember = async (groupId: string, userId: string) => {
    setRemoveMemberSuccess(false);

    try {
      const { data } = await axios.put(
        `/api/groups/remove-member?groupId=${groupId}&userId=${userId}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data) {
        setRemoveMemberSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const leaveGroup = async (groupId: string) => {
    setLeaveGroupLoading(true);
    setLeaveGroupSuccess(false);

    try {
      const { data } = await axios.put(
        `/api/groups/leave/${groupId}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data) {
        setLeaveGroupLoading(false);
        setRemoveMemberSuccess(true);
      }
    } catch (error) {
      setLeaveGroupLoading(false);
      console.error(error);
    }
  };

  const contextData = {
    createGroup,
    getGroups,
    getGroup,
    searchGroups,
    groups,
    group,
    groupMembers,
    searchedGroups,
    groupCount,
    searchedGroupsCount,
    crGroupLoading,
    crGroupSuccess,
    getGroupsLoading,
    getGroupLoading,
    searchLoading,
    addMember,
    addMemberLoading,
    addMemberSuccess,
    removeMember,
    removeMemberSuccess,
    leaveGroup,
    leaveGroupLoading,
    leaveGroupSuccess,
  };

  return (
    <GroupContext.Provider value={contextData}>
      {children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
