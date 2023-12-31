import React, { useState } from "react";
import { Link } from "react-router-dom";
import SettingNav from "./SettingNav";
import axios from "axios";
import { toast } from "react-toastify";

const PwChange = () => {
  const [oriPassword, setOriPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");

  const pwChangeProcess = (event) => {
    event.preventDefault();
    if (oriPassword && newPassword && reNewPassword) {
      axios({
        url: "/api/user/pwChange",
        method: "POST",
        withCredentials: true,
        timeout: "5000",
        data: {
          oriPassword: oriPassword,
          newPassword: newPassword,
          reNewPassword: reNewPassword,
        },
      })
        .then((result) => {
          if (result.status === 200) {
            alert(result.data);
            window.location.reload();
          } else if (result.status === 403) {
            toast("아이디와 비밀번호가 일치하지 않습니다.", {
              type: "warning",
            });
          }
        })
        .catch((error) => {
          if (error.response) {
            toast(error.response.data, { type: "error" });
          }
        });
    } else {
      toast("아이디와 비밀번호를 입력해주세요.", { type: "warning" });
    }
  };

  return (
    <div className="d-flex flex-wrap" style={{ width: "100%" }}>
      <SettingNav />
      <div className="m-5 mx-auto">
        <div className="fs-3">비밀번호 변경</div>
        <div className="my-5">
          <p>
            누군가 액세스 권한을 얻으려고 시도 중인 경우 계정을 보호하기 위해 이
            세션을 제외한 모든 세션에서 로그아웃됩니다.
          </p>
          <p>
            비밀번호는 6자 이상이어야 하고 숫자, 영문, 특수기호(!$@%)의 조합을
            포함해야 합니다.
          </p>
        </div>

        <input
          type="password"
          className="form-control mb-2"
          id="originalPassword"
          placeholder="현재 비밀번호"
          onChange={(e) => setOriPassword(e.target.value)}
        ></input>
        <input
          type="password"
          className="form-control mb-2"
          id="newPassword"
          placeholder="새 비밀번호"
          onChange={(e) => setNewPassword(e.target.value)}
        ></input>
        <input
          type="password"
          className="form-control mb-2"
          id="reNewPassword"
          placeholder="새 비밀번호 재입력"
          onChange={(e) => setReNewPassword(e.target.value)}
        ></input>
        <Link to="/findpw">
          <p>비밀번호를 잊으셨나요?</p>
        </Link>
        <Link>
          <button
            type="button"
            className="btn btn-primary"
            onClick={pwChangeProcess}
          >
            비밀번호 변경
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PwChange;
