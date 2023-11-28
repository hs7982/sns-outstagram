import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Singup( {changeNav} ) {
  changeNav();
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const appendAlert = (message, type) => {
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    alertPlaceholder.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
      `   <div><i class="bi bi-exclamation-triangle-fill"></i> ${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
  };

  const singup = () => {
    if (name && userName && tel && email && password && rePassword) {
      if (password === rePassword) {
        axios({
          url: "/api/user/singup",
          method: "POST",
          withCredentials: true,
          timeout: "5000",
          data: {
            name: name,
            userName: userName,
            tel: tel,
            email: email,
            password: password,
          },
        })
          .then((result) => {
            if (result.status === 201) {
              appendAlert(result.data, "info")
              alert("계정 생성이 완료되었습니다. 로그인해주세요.")
              window.open("/login", "_self")
            }
          })
          .catch((error) => {
            if (error.response) {
              appendAlert(error.response.data, "warning");
            }
          });
      } else {
        appendAlert("비밀번호 확인값이 일치하지 않습니다.", "warning");
      }
    } else {
      appendAlert("모든 항목을 입력해주세요.", "warning");
    }
  };

  return (
    <div className="mt-5 container-xl">
      {" "}
      <h1 className="mb-5">OUTSTAGRAM 가입하기</h1>
      <div className="form-floating my-2">
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="성명"
          onChange={(e) => setName(e.target.value)}
        ></input>
        <label htmlFor="floatingInput">성명 (ex: 홍길동)</label>
      </div>
      <div className="form-floating my-2">
        <input
          type="text"
          className="form-control"
          id="username"
          placeholder="사용자 이름"
          onChange={(e) => setUserName(e.target.value)}
        ></input>
        <label htmlFor="floatingInput">사용자 이름(계정명)</label>
      </div>
      <div className="form-floating my-2">
        <input
          type="tel"
          className="form-control"
          id="tel"
          placeholder="전화번호"
          onChange={(e) => setTel(e.target.value)}
        ></input>
        <label htmlFor="floatingInput">전화번호</label>
      </div>
      <div className="form-floating my-2">
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="이메일"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label htmlFor="floatingInput">이메일</label>
      </div>
      <div className="form-floating my-2">
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="비밀번호"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <label htmlFor="floatingInput">비밀번호</label>
      </div>
      <div className="form-floating my-2">
        <input
          type="password"
          className="form-control"
          id="repassword"
          placeholder="비밀번호 확인"
          onChange={(e) => setRePassword(e.target.value)}
        ></input>
        <label htmlFor="floatingInput">비밀번호 확인</label>
      </div>
      <div id="liveAlertPlaceholder"></div>
      <button type="button" className="btn btn-primary" onClick={singup}>
        가입
      </button>
      <div>
        <div>
          <p className="text-secondary mt-3">
            가입하면 outstagram의 약관,데이터 정책 및 쿠키 정책에 동의하게
            됩니다.
          </p>
        </div>
        <div>
          <p>
            계정이 있으신가요? <Link to="/login" className="text-decoration-none">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
