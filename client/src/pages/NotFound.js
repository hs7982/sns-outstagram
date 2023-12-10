import React from "react";

const NotFound = () => {
  return (
    <div className="mx-auto my-5">
      <i className="bi bi-exclamation-diamond fs-1"></i>
      <div className="mt-1 fs-2">페이지를 찾을 수 없습니다!</div>
      <p>404 Not Found</p>
      <a href="/">
        <button className="btn btn-primary my-4">홈으로</button>
      </a>
    </div>
  );
};

export default NotFound;
