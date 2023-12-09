import React from "react";
import { Link } from "react-router-dom";

const activeClass = (btn) => {
  const path = window.location.pathname;
  const active = "list-group-item list-group-item-action active";
  const disabled = "list-group-item list-group-item-action";
  if (btn === path) return active;
  else return disabled;
};

const SettingNav = () => {
  return (
    <div className="m-3" style={{ width: "350px" }}>
      <div className="list-group mx-auto">
        <p className="fs-3 text-start">설정</p>
        <Link to="/setting" className="text-dark text-decoration-none">
          <button type="button" className={activeClass("/setting")}>
            소개
          </button>
        </Link>
        <Link
          to="/setting/infochange"
          className="text-dark text-decoration-none"
        >
          <button type="button" className={activeClass("/setting/infochange")}>
            회원정보 변경
          </button>
        </Link>
        <Link to="/setting/pwchange" className="text-dark text-decoration-none">
          <button type="button" className={activeClass("/setting/pwchange")}>
            비밀번호 변경
          </button>
        </Link>
        <Link
          to="/setting/tip/service"
          className="text-dark text-decoration-none"
        >
          <button type="button" className={activeClass("/setting/tip/service")}>
            도움말
          </button>
        </Link>
        <Link
          to="/setting/leaveaccount"
          className="text-dark text-decoration-none"
        >
          <button
            type="button"
            className={activeClass("/setting/leaveaccount")}
          >
            계정탈퇴
          </button>
        </Link>
        <Link to="/logout" className="text-dark text-decoration-none">
          <button type="button" className={activeClass("/logout")}>
            로그아웃
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SettingNav;
