import React from "react";
import { Link } from "react-router-dom";

const SettingNav = () => {
  return (
    <div class="border-end pe-3" style={{ width: "250px" }}>
      <p className="text-start fs-3 my-3">설정</p>
      <hr />
      <Link to="/setting" className="text-dark text-decoration-none">
        <p className="text-start fs-5 my-4">웹 소개</p>
      </Link>
      <Link to="/setting/infochange" className="text-dark text-decoration-none">
        <p className="text-start fs-5 my-4">정보 변경</p>
      </Link>
      <Link to="/setting/pwchange" className="text-dark text-decoration-none">
        <p className="text-start fs-5 my-4">비밀번호 변경</p>
      </Link>
      <Link to="/setting/tip/service" className="text-dark text-decoration-none">
        <p className="text-start fs-5 my-4">도움말</p>
      </Link>
      <Link to="/setting/leaveaccount" className="text-dark text-decoration-none">
        <p className="text-start fs-5 my-4">계정 탈퇴</p>
      </Link>
      <Link to="/logout" className="text-dark text-decoration-none">
        <p className="text-start fs-5 my-4">로그아웃</p>
      </Link>
      <div className="b-example-vr"></div>
    </div>
  );
};

export default SettingNav;
