import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({isLogin:false,userName:null});

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     console.log(storedUser);
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  useEffect(() => {
    //const storedUser = localStorage.getItem('user');
    axios({
      url: "/api/user/myInfo",
      method: "GET",
      withCredentials: true,
      timeout: 5000,
    }).then((response) => {
    setUser(response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
    })
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    axios({
      url: "/api/user/logout",
      method: "POST",
      withCredentials: true,
      timeout: "5000",
    }).then((response) => {
      setUser({isLogin:false,userName:null});
      localStorage.removeItem('user');
      window.open("/", "_self");
      alert('로그아웃되었습니다.')
    }).catch((error) => {
      alert('로그아웃 실패' + error.data );
    })

  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}