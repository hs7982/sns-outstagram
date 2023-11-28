import React from "react";
import { Link } from "react-router-dom";

const FindPw = ({ changeNav }) => {
  changeNav();
  return (
    <div className="mx-auto" style={{ width: "100%" }}>
      <p className=" my-3 fw-bold">비밀번호를 재설정하시겠습니까?</p>
      <p>
        이메일 주소를 입력하시면 계정에 다시 액세스할 수 있는 링크를
        보내드립니다.
      </p>
      <input
        type="password"
        className="form-control mb-2 mx-auto"
        id="newPassword"
        placeholder="이메일 주소"
        style={{ width: "40rem" }}
      ></input>
      <Link>
        <button type="button " className="btn btn-primary my-3">
          로그인 링크 보내기
        </button>
      </Link>

      <Link to="/login">
        <p>로그인으로 돌아가기</p>
      </Link>
    </div>
  );
};

export default FindPw;
