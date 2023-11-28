import React from "react";

const NotFound = () => {
  return (
    <div className="m-auto" style={{ width: "100%" }}>
      <h1 className="mt-5">
        <i class="bi bi-exclamation-diamond"></i>
        <br />
        페이지를 찾을 수 없습니다!
      </h1>
      <p>404 Not Found</p>
    </div>
  );
};

export default NotFound;