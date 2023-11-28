//팔로우 버튼 눌렀을때 팔로잉으로 바뀌는 화면 구성

import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

const Follow = () => {

    return (
        
            <div class="container px-4 text-center overflow-auto">
                
      <div>
        <p class="fw-bold fs-4 d-flex flex-row mb-3">프로필</p>
      </div>
      <div className="d-flex">
        <div class="text-start p-5">
        <img
            src={"/api/upload/profile/"}
            alt=""
            width="100"
            height="100"
            className="rounded-circle me-2 bg-secondary-subtle object-fit-cover border"
          ></img>
          <div className="mx-3 my-1">test</div>
        </div>

        <div class="container overflow-hidden text-center">
        <div class="d-flex justify-content-between">
         
            
            <div class="row gx-5 fw-bold">
              <div class="col"></div> 
                <div class="p-3">게시물 </div>
              </div>
              
              <Link to="/profile/follower">
              <div class="col">
                <div class="p-3 mx-auto">팔로워 </div>
              </div>
              </Link>

              <Link to="/profile/following">
              <div class="col">
                <div class="p-3">팔로잉 </div>
              </div>
              </Link>
            </div>
            <div className="my-5">
          <hr></hr>
            </div>
          <Link to="/profile">
            <div>
              <button type="button" class="btn btn-primary mx-3 my-5">
                팔로잉 취소
              </button>
            </div>
          </Link>
          <hr></hr>
          <div class="card my-3" style={{ width: "18rem;" }}>
            <div class="card-body">
              <h5 class="card-title">게시물1</h5>
            </div>
          </div>

          <div class="card my-3" style={{ width: "18rem;" }}>
            <div class="card-body">
              <h5 class="card-title">게시물2</h5>
            </div>
          </div>

          <div class="card" style={{ width: "18rem;" }}>
            <div class="card-body">
              <h5 class="card-title">게시물3</h5>
            </div>
        </div>
        </div>
        </div>
        </div>
    );
};

export default Follow;