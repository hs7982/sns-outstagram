import React from "react";
import axios from "axios";
import SettingNav from "./SettingNav";

const LeaveAccount = () => {
  const LeaveAccountProcess = (event) => {
    event.preventDefault();
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      axios({
        url: "/api/user/leaveId",
        method: "POST",
        withCredentials: true,
        timeout: "5000",
        data: {
          true: true,
        },
      }).then((result) => {
        if (result.status === 200) {
          alert("계정 탈퇴에 성공하였습니다.\n이용해주셔서 감사합니다.");
          window.open("/", "_self");
        }
      });
    }
  };

  return (
    <div className="d-flex flex-wrap m-auto" style={{ width: "100%" }}>
      <SettingNav />
      <div className="mx-auto">
        <h1 className="mt-5">
          <i className="bi bi-exclamation-diamond"></i>
          <br />
          회원 탈퇴를 하시겠습니까?
        </h1>
        <p className="m-3">
          탈퇴 시 관련된 모든 정보가 삭제되며, 복구가 불가능합니다.
        </p>
        <button
          type="button"
          className="btn btn-primary my-3"
          onClick={LeaveAccountProcess}
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
};

export default LeaveAccount;
