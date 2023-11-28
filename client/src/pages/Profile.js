import React, { useContext, useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../components/UserContext";

const Profile = () => {
  const user = useContext(UserContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(0); // 추가: 팔로우 갯수 상태
  
  
  

 




  return (
    <div class="container px-4 text-center overflow-auto">
      <div>
        <p class="fw-bold fs-4 d-flex flex-row mb-3">프로필</p>
      </div>
      <div className="d-flex">
        <div class="p-5">
          <img
            src={"/api/upload/profile/" + user.user.userProfileImg}
            alt=""
            width="100"
            height="100"
            className="rounded-circle bg-secondary-subtle object-fit-cover border"
          ></img>

          <p className="mx-3 my-1">{user.user.userName}</p>
        </div>
        
        <div class="container overflow-hidden text-center">
          <div class="d-flex justify-content-between">
            
            <div class="row gx-5 fw-bold">
              <div class="col"></div>
              <div class="p-3">게시물</div> 
            </div>

            <Link to="follower">
              <div class="col">
                <div class="p-3 mx-auto">팔로워 </div>
              </div>
            </Link>

            <Link to="following">
              <div class="col">
                <div class="p-3">팔로잉 </div>
              </div>
            </Link>
          </div>
          <div className="my-5">
            <hr></hr>
          </div>
          
            <div>
              <button type="button" 
                      className="btn btn-primary mx-3 my-5"
                      
              >
                {isFollowing ? "팔로우 취소" : "팔로우"}
              </button>
            </div>
          
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

export default Profile;
