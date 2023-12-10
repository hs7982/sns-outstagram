import React, { createContext, useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-toastify";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({ isLogin: false, userName: null });

  useEffect(() => {
    axios({
      url: "/api/user/myInfo",
      method: "GET",
      withCredentials: true,
      timeout: 10000,
    }).then((response) => {
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    });
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    axios({
      url: "/api/user/logout",
      method: "POST",
      withCredentials: true,
      timeout: "5000",
    })
      .then((response) => {
        setUser({ isLogin: false, userName: null });
        localStorage.removeItem("user");
        toast("🔓 로그아웃되었습니다.", { type: "success", autoClose: 2500 });
      })
      .catch((error) => {
        toast("로그아웃 중 오류가 발생하였습니다.", { type: "error" });
      });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
