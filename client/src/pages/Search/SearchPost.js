import React from "react";
import { Link } from "react-router-dom";
import Search from "./Search";

const SearchPost = () => {
  return (
    <div className="m-4 overflow-auto" style={{ width: "100%" }}>
      <Search/>
      <p className="text-start my-3 fw-bold">게시물 검색결과</p>
      



      </div>
  );
};


export default SearchPost;
