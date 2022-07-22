import axios, { AxiosError } from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";

interface childrenIFace {
  children: ReactNode;
}

interface userIFace {
  id: string;
  username: string;
  avatar: string;
  providerId: string;
  providerName: string;
}

interface registerUserIFace {
  username: string;
  password: string;
  email?: string;
}

interface authContextIFace {
  user: userIFace;
  register: (userData: registerUserIFace) => void;
  login: (userData: registerUserIFace) => void;
  logout: () => void;

  logoutSuccess: boolean;

  regLoading: boolean;
  regError: string | null;
  regSuccess: boolean;

  loginLoading: boolean;
  loginError: string | null;
  loginSuccess: boolean;
}

const url = "http://localhost:5000";

export const AuthContext = createContext({} as authContextIFace);

const AuthProvider = ({ children }: childrenIFace) => {
  const [user, setUser] = useState({} as userIFace);

  const [logoutSuccess, setLogoutSuccess] = useState(false);

  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState(null);
  const [regSuccess, setRegSuccess] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      setUser(JSON.parse(localStorage.getItem("userInfo") || ""));
    }

    getOauthUser();
  }, []);

  const getOauthUser = async () => {
    const res = await fetch(`/api/auth/user-data`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) console.log("something went wrong");

    if (data) {
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
    }
  };

  const register = async (userData: registerUserIFace) => {
    console.log(userData);
    try {
      setRegLoading(true);
      setRegError(null);

      const { data } = await axios.post(`/api/users/register`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (data) {
        setRegLoading(false);
        setUser(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
        setRegSuccess(true);
      }
    } catch (error: any) {
      setRegLoading(false);
      error.response && error.response.data.message
        ? setRegError(error.response.data.message)
        : setRegError(error.message);
    }
  };

  const login = async (userData: registerUserIFace) => {
    try {
      setLoginLoading(true);
      setLoginError(null);

      const { data } = await axios.post(`/api/users/login`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (data) {
        setLoginLoading(false);
        setLoginSuccess(true);
        setUser(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
      }
    } catch (error: AxiosError | any) {
      setLoginLoading(false);
      error.response && error.response.data.message
        ? setLoginError(error.response.data.message)
        : setLoginError(error.message);
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.get(`/api/users/logout`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (data) {
        setLogoutSuccess(true);
        localStorage.removeItem("userInfo");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contextData = {
    user,
    regLoading,
    regError,
    regSuccess,
    register,
    logout,
    logoutSuccess,
    loginLoading,
    loginError,
    loginSuccess,
    login,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
