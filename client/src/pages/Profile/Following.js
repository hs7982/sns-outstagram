//팔로우 버튼 누르면 이 사람을 팔로잉 하게 바꿈.
import React from "react";
import { Link } from "react-router-dom";
import Profile from "../Profile";
const Following = () => {
    return (
        <div class="mx-auto card" style={{"width": "18rem"}}>
        <div class="card-header">
          팔로잉
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item text-start">test@test
          <button type="button" class="btn btn-secondary mx-4">
                팔로잉 취소
              </button>
          </li>
        </ul>
      </div>
    );
};

export default Following;