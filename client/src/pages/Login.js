import React from "react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/UserContext";

export default function Login({ changeNav }) {
  changeNav();
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const appendAlert = (message, type) => {
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    alertPlaceholder.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
      `   <div><i class="bi bi-exclamation-triangle-fill"></i> ${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
  };

  const loginProcess = (event) => {
    event.preventDefault();
    if (email && password) {
      axios({
        url: "/api/user/login",
        method: "POST",
        withCredentials: true,
        timeout: 5000,
        data: {
          email: email,
          password: password,
        },
      })
        .then((result) => {
          if (result.status === 200) {
            login(result.data);
            window.open("/", "_self");
            appendAlert("로그인에 성공하였습니다.", "info");
          } else if (result.status === 403) {
            appendAlert("아이디와 비밀번호가 일치하지 않습니다.", "warning");
          }
        })
        .catch((error) => {
          if (error.response) {
            appendAlert(error.response.data, "warning");
          }
        });
    } else {
      appendAlert("아이디와 비밀번호를 입력해주세요", "warning");
    }
  };

  return (
    <div className="mt-5 container-xl">
      {" "}
      <h1 style={{ fontFamily: "Just Another Hand, cursive" }}>OUTSTAGRAM</h1>
      <p className="fs-4">로그인</p>
      <form className="login">
        <div className="form-floating mt-5 mb-3">
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <label htmlFor="floatingInput">이메일</label>
        </div>
        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <label htmlFor="floatingInput">비밀번호</label>
        </div>
        <div id="liveAlertPlaceholder"></div>
        <button
          className="btn btn-primary mb-3"
          type="submit"
          onClick={loginProcess}
        >
          로그인
        </button>
      </form>
      <p>
        계정이 없으신가요?{" "}
        <Link to="/singup" className="text-decoration-none">
          가입하기
        </Link>
      </p>
      <p>
        비밀번호를 분실하셨나요?{" "}
        <Link to="/findpw" className="text-decoration-none">
          비밀번호 재설정
        </Link>
      </p>
    </div>
  );
}
