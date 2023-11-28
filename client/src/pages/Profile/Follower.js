//팔로우 버튼 누르고 거기서 팔로워
import React from "react";
import { Link } from "react-router-dom";
import Profile from "../Profile";
const Follower = () => {
    return (
        <div class="mx-auto card" style={{"width": "18rem"}}>
        <div class="card-header">
          팔로워
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item text-start">test@test
          <button type="button" class="btn btn-secondary mx-5">
                팔로잉
              </button>
          </li>
        </ul>
      </div>
  
    );
};

export default Follower;