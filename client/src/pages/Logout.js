import React, { useContext } from "react";
import { UserContext } from "../components/UserContext";

const Logout = () => {
  const user = useContext(UserContext);

  const logoutProcess = (event) => {
    user.logout();
  };

  return (
    <div className="m-auto" style={{ width: "100%" }}>
      <h1 className="mt-5">
        <i className="bi bi-exclamation-diamond"></i>
        <br />
        로그아웃하시겠습니까?
      </h1>
      <button
        type="button"
        className="btn btn-primary my-5"
        onClick={logoutProcess}
      >
        로그아웃
      </button>
    </div>
  );
};

export default Logout;
