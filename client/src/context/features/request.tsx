import axios from "axios";
import { createContext, ReactNode, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface childrenIFace {
  children: ReactNode;
}

interface reqIFace {
  _id: string;
  from: {
    _id: string;
    username: string;
    avatar: string;
  };
  to: string;
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface groupRequsetsIFace {
  _id: string;
  from: {
    _id: string;
    username: string;
    avatar: string;
  };
}

interface reqContextIFace {
  requests: reqIFace[];
  groupRequests: groupRequsetsIFace[];
  reqCount: number;
  reqMsg: string;
  getMyRequests: () => void;
  createRequest: (userId: string) => void;
  acceptRequest: (reqId: string) => void;
  rejectRequest: (reqId: string) => void;
  sendGroupRequest: (groupId: string) => void;
  getGroupRequests: (groupId: string) => void;
  acceptGroupRequest: (reqId: string) => void;
  rejectGroupRequest: (reqId: string) => void;
  crReqSuccess: boolean;
  getReqLoading: boolean;
  accReqSuccess: boolean;
  accReqLoading: boolean;
  rejReqLoading: boolean;
  rejReqSuccess: boolean;
  sendReqSuccess: boolean;
  accGroupReqSuccess: boolean;
  rejGroupReqSuccess: boolean;
}

export const ReqContext = createContext({} as reqContextIFace);

const RequestProvider = ({ children }: childrenIFace) => {
  const [crReqSuccess, setCrReqSuccess] = useState(false);

  const [requests, setRequests] = useState<reqIFace[]>([]);
  const [groupRequests, setGroupRequests] = useState<groupRequsetsIFace[]>([]);
  const [reqCount, setReqCount] = useState(0);
  const [reqMsg, setReqMsg] = useState("");
  const [getReqLoading, setGetReqLoading] = useState(false);

  const [accReqSuccess, setAccReqSuccess] = useState(false);
  const [accReqLoading, setAccReqLoading] = useState(false);
  const [accGroupReqSuccess, setAccGroupReqSuccess] = useState(false);
  const [rejReqSuccess, setRejReqSuccess] = useState(false);
  const [rejReqLoading, setRejReqLoading] = useState(false);
  const [rejGroupReqSuccess, setRejGroupReqSuccess] = useState(false);
  const [sendReqSuccess, setSendReqSuccess] = useState(false);

  const createRequest = async (userId: string) => {
    setCrReqSuccess(false);

    try {
      const { data } = await axios.post(
        `/api/requests/create?userId=${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (data) {
        setCrReqSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMyRequests = async () => {
    try {
      setGetReqLoading(true);

      const { data } = await axios.get("/api/requests/fetch-my", {
        withCredentials: true,
      });

      if (data) {
        const reqs = data.requests?.map((req: reqIFace) => {
          const createdAt = formatDistanceToNow(new Date(req.createdAt));
          return { ...req, createdAt };
        });

        setGetReqLoading(false);
        setRequests(reqs);
        setReqCount(data.count);
        setReqMsg(data.msg);
      }
    } catch (error) {
      setGetReqLoading(false);
      console.log(error);
    }
  };

  const acceptRequest = async (reqId: string) => {
    setAccReqSuccess(false);
    setAccReqLoading(true);

    try {
      const { data } = await axios.put(
        `/api/requests/accept/${reqId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (data) {
        setAccReqLoading(false);
        setAccReqSuccess(true);
      }
    } catch (error) {
      setAccReqLoading(false);
      console.log(error);
    }
  };

  const rejectRequest = async (reqId: string) => {
    setRejReqSuccess(false);
    setRejReqLoading(true);

    try {
      const { data } = await axios.delete(`/api/requests/reject/${reqId}`, {
        withCredentials: true,
      });

      if (data) {
        setRejReqSuccess(true);
        setRejReqLoading(false);
      }
    } catch (error) {
      setRejReqLoading(false);
      console.log(error);
    }
  };

  const sendGroupRequest = async (groupId: string) => {
    setSendReqSuccess(false);

    try {
      const { data } = await axios.post(
        `/api/requests/group-req?groupId=${groupId}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data) {
        setSendReqSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getGroupRequests = async (groupId: string) => {
    try {
      const { data } = await axios.get(
        `/api/requests/fetch-group-reqs/${groupId}`,
        { withCredentials: true }
      );

      if (data) {
        setGroupRequests(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const acceptGroupRequest = async (reqId: string) => {
    setAccGroupReqSuccess(false);

    try {
      const { data } = await axios.put(
        `/api/requests/accept-group-req/${reqId}`,
        {
          withCredentials: true,
        }
      );

      if (data) {
        setAccGroupReqSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const rejectGroupRequest = async (reqId: string) => {
    setRejGroupReqSuccess(false);

    try {
      const { data } = await axios.put(
        `/api/requests/reject-group-req/${reqId}`,
        {
          withCredentials: true,
        }
      );

      if (data) {
        setRejGroupReqSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const contextData = {
    createRequest,
    crReqSuccess,
    getMyRequests,
    requests,
    reqCount,
    reqMsg,
    getReqLoading,
    acceptRequest,
    accReqSuccess,
    accReqLoading,
    rejReqSuccess,
    rejReqLoading,
    rejectRequest,
    sendGroupRequest,
    sendReqSuccess,
    getGroupRequests,
    groupRequests,
    accGroupReqSuccess,
    acceptGroupRequest,
    rejectGroupRequest,
    rejGroupReqSuccess,
  };

  return (
    <ReqContext.Provider value={contextData}>{children}</ReqContext.Provider>
  );
};

export default RequestProvider;
