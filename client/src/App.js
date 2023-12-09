import React from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomeFeed/Home";
import NotFound from "./pages/NotFound";
import "./App.css";
import Singup from "./pages/Singup";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar";
import Info from "./pages/Setting/Info";
import PwChange from "./pages/Setting/PwChange";
import InfoChange from "./pages/Setting/InfoChange";
import Auth from "./components/authRoute";
import Logout from "./pages/Logout";
import Service from "./pages/Setting/Service";
import LeaveAccount from "./pages/Setting/LeaveAccount";
import WritePost from "./pages/WritePost";
import Notice from "./pages/Notice";
import FindPw from "./pages/FindPw";
import Profile from "./pages/Profile/Profile";
import Search from "./pages/Search/Search";
import Admin from "./pages/Admin";
import PostView from "./pages/HomeFeed/PostView";

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
  const AuthAdmin = Auth(Admin, true, true);
  const AuthPostView = Auth(PostView, true);
  const AuthProfile = Auth(Profile, true);

  return (
    <div className="App">
      <main className="d-flex flex-nowrap">
        <h1 className="visually-hidden">OUTSTAGRAM</h1>

        {showNav && <AuthNavbar />}
        <div className="flex-column w-100 overflow-y-auto">
          <div className="w-100 d-md-none" style={{ height: "80px" }}></div>

          <Routes>
            <Route path="/" element={<AuthHome />} />

            <Route path="/singup" element={<Singup changeNav={changeNav} />} />
            <Route path="/login" element={<Login changeNav={changeNav} />} />
            <Route path="/findpw" element={<FindPw changeNav={changeNav} />} />
            <Route path="/setting" element={<Info />} />

            <Route path="/setting/pwchange" element={<AuthPwChange />} />
            <Route path="/setting/infochange" element={<AuthInfoChange />} />
            <Route path="/logout" element={<AuthLogout />} />
            <Route path="/setting/tip/service" element={<AuthService />} />
            <Route
              path="/setting/leaveaccount"
              element={<AuthLeaveAccount />}
            />
            <Route path="/writepost" element={<AuthWritePost />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/search" element={<AuthSearch />} />
            <Route path="/profile" element={<AuthProfile />} />
            <Route path="/profile/:id" element={<AuthProfile />} />
            <Route path="/admin" element={<AuthAdmin />} />
            <Route path="/postView/:postId" element={<AuthPostView />} />

            {/* **항상 최하단위치 여기 아래론 라우트 X** */}
            <Route path="/*" element={<NotFound changeNav={changeNav} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
