import React, { Fragment, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../components/UserContext";

const Navbar = ({ children }) => {
  const user = useContext(UserContext);
  const [isNavOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  return (
    <Fragment>
      {/* 미디어 쿼리를 사용하여 화면 너비에 따라 버튼 표시 여부 결정 */}
      <button
        className="navbar-toggler d-md-none position-fixed border rounded m-2 shadow bg-primary bg-gradient" // d-md-none 클래스 추가
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        onClick={toggleNav}
        style={{
          width: "50px",
          height: "50px",
          bottom: "10px",
          right: "10px",
          backgroundColor: "#fff",
          zIndex: 1000, // z-index 추가
        }}
      >
        <span
          className="bi bi-layout-sidebar-inset text-white"

        ></span>
      </button>

      <div
        className={`collapse d-md-flex flex-column flex-shrink-0 p-3 border-end ${
          isNavOpen ? "show" : ""
        }`}
        id="navbarNav"
        style={{ width: "300px" }}
      >
        <Link
          to="/"
          className="navbar-brand mb-3 text-decoration-none text-dark "
        >
          <h1
            className="h1 mt-3 text-center "
            style={{ fontFamily: "Just Another Hand, cursive" }}
          >
            OUTSTAGRAM
          </h1>
        </Link>
        <ul className="nav nav-pills flex-column ms-2 mb-auto">
          <li className="nav-item">
            <Link
              className="nav-link text-dark text-decoration-none mb-3 text-start"
              aria-current="page"
              to="/"
            >
              <i
                className="bi bi-house-door me-2"
                style={{ fontSize: "1.5rem" }}
              ></i>{" "}
              홈
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-dark text-decoration-none mb-3 text-start"
              to="/search"
            >
              <i
                className="bi bi-search me-2"
                style={{ fontSize: "1.5rem" }}
              ></i>{" "}
              검색
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-dark text-decoration-none mb-3 text-start"
              to="/message"
            >
              <i
                className="bi bi-chat-left me-2"
                style={{ fontSize: "1.5rem" }}
              ></i>{" "}
              메시지
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link  text-dark text-decoration-none mb-3 text-start"
              to="/notice"
            >
              <i className="bi bi-bell me-2" style={{ fontSize: "1.5rem" }}></i>{" "}
              알림
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link  text-dark text-decoration-none mb-3 text-start"
              to="/profile"
            >
              <i
                className="bi bi-person me-2"
                style={{ fontSize: "1.5rem" }}
              ></i>{" "}
              프로필
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link  text-dark text-decoration-none mb-3 text-start"
              to="/writepost"
            >
              <i
                className="bi bi-plus-circle me-2"
                style={{ fontSize: "1.5rem" }}
              ></i>{" "}
              업로드
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link  text-dark text-decoration-none mb-3 text-start"
              to="/setting"
            >
              <i className="bi bi-gear me-2" style={{ fontSize: "1.5rem" }}></i>{" "}
              설정
            </Link>
          </li>
        </ul>

        <hr />
        <div className="dropdown ms-2">
          <Link
            href="#"
            className="d-flex align-items-center text-black text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src={"/api/upload/profile/" + user.user.userProfileImg}
              alt=""
              width="32"
              height="32"
              className="rounded-circle me-2 bg-secondary-subtle object-fit-cover border"
            ></img>
            <strong>{user.user.userName}</strong>
          </Link>
          <ul className="dropdown-menu dropdown-menu text-small shadow">
            <li>
              <Link className="dropdown-item" to="/logout">
                로그아웃
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="b-example-vr"></div>
    </Fragment>
  );
};

export default Navbar;