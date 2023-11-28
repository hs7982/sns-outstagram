import React from "react";
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import "./App.css";
import Singup from "./pages/Singup";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar";
import Info from "./pages/Setting/Info";
import PwChange from "./pages/Setting/PwChange";
import InfoChange from "./pages/Setting/InfoChange";
import Tip from "./pages/Setting/Tip";
import Auth from "./components/authRoute";
import Logout from "./pages/Logout";
import Service from "./pages/Setting/Service";
import LeaveAccount from "./pages/Setting/LeaveAccount";
import WritePost from "./pages/WritePost";
import Notice from "./pages/Notice";
import SearchPost from "./pages/Search/SearchPost";
import Tag from "./pages/Search/Tag";
import Human from "./pages/Search/Human";
import Place from "./pages/Search/Place";
import FindPw from "./pages/FindPw";
import Profile from "./pages/Profile";
import Follow from "./pages/Profile/Follow";
import Following from "./pages/Profile/Following";
import Follower from "./pages/Profile/Follower";

import Search from "./pages/Search/Search";


function App() {
  const [showNav, setShowNav] = useState(true);
  const changeNav = () => {
    setShowNav(false);
  };
  /*auth 관리
    ex)const AuthHome = Auth(Home, true) 
    - null: 아무나 출입이 가능한 페이지
    - true: 로그인한 유저만 출입이 가능한 페이지
    - false: 로그인한 유저는 출입 불가능한 페이지
  */
  const AuthHome = Auth(Home, true);
  
  const AuthLogout = Auth(Logout, true);
  const AuthPwChange = Auth(PwChange, true);
  const AuthInfoChange = Auth(InfoChange, true);
  const AuthNavbar = Auth(Navbar, null);
  const AuthService = Auth(Service, true);
  const AuthSearch = Auth(Search, true);
  const AuthLeaveAccount = Auth(LeaveAccount, true);
  const AuthWritePost = Auth(WritePost, true);
  
  return (
    <div className="App">
      <main className="d-flex flex-nowrap">
        <h1 className="visually-hidden">OUTSTAGRAM</h1>

        {showNav && <AuthNavbar />}

        <Routes>
          <Route path="/" element={<AuthHome />} />

          <Route path="/singup" element={<Singup changeNav={changeNav} />} />
          <Route path="/login" element={<Login changeNav={changeNav} />} />
          <Route path="/findpw" element={<FindPw changeNav={changeNav} />} />
          <Route path="/setting" element={<Info />} />
          <Route path="/setting/pwchange" element={<AuthPwChange />} />
          <Route path="/setting/infochange" element={<AuthInfoChange />} />
          <Route path="/setting/tip" element={<Tip />} />
          <Route path="/logout" element={<AuthLogout />} />
          <Route path="/setting/tip/service" element={<AuthService />} />
          <Route path="/setting/leaveaccount" element={<AuthLeaveAccount />} />
          <Route path="/writepost" element={<AuthWritePost />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/search" element={<AuthSearch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/follow" element={<Follow />} />
          <Route path="/profile/following" element={<Following />} />
          <Route path="/profile/follower" element={<Follower />} />


          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
