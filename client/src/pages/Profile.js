import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import axios from "axios";

const Profile = () => {
  const user = useContext(UserContext);
  const params = useParams();
  const [userId, setUserId] = useState(params.id);
  const [userData, setUserData] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isErr, setIsErr] = useState(false);
  const [isNoUser, setIsNoUser] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        //유저정보 가져오기
        const userResult = await axios({
          method: "GET",
          url: `/api/user/${userId}`,
          withCredentials: true,
          timeout: 5000,
        });

        if (userResult.status === 200) {
          setIsNoUser(false);
          setUserData(userResult.data[0]);
        } else if (followerResult.status === 204) {
          setIsNoUser(true);
        }

        //팔로우 여부 확인
        const isFollowedResult = await axios({
          method: "GET",
          url: `/api/user/isFollowing/${userId}`,
          withCredentials: true,
          timeout: 5000,
        });

        if (isFollowedResult.status === 200) {
          if (isFollowedResult.data === true) {
            setIsFollowing(true);
          } else if (isFollowedResult.data === false) {
            setIsFollowing(false);
          } else {
            setIsFollowing(null);
          }
        }

        // 팔로워 수 가져오기
        const followerResult = await axios({
          method: "GET",
          url: `/api/user/followerNum/${userId}`,
          withCredentials: true,
          timeout: 5000,
        });

        if (followerResult.status === 200) {
          setFollowerCount(followerResult.data);
        }

        // 팔로잉 수 가져오기
        const followingResult = await axios({
          method: "GET",
          url: `/api/user/followingNum/${userId}`,
          withCredentials: true,
          timeout: 5000,
        });

        if (followingResult.status === 200) {
          setFollowingCount(followingResult.data);
        }
      } catch (error) {
        setIsErr(true);
        console.error("데이터를 가져오는 중 오류:", error);
      }
    }

    if (userId === undefined) {
      setUserId(user.user.userIdNo);
    } else {
      fetchData();
    }
  }, [userId, isFollowing]);

  const followBtn = async () => {
    try {
      const result = await axios({
        method: "POST",
        url: `/api/user/follow`,
        data: { userId },
        withCredentials: true,
        timeout: 5000,
      });

      if (result.status === 201) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("팔로잉 요청 중 오류:", error);
      alert("ERROR:팔로잉 중 에러 발생");
    }
  };

  const unFollowBtn = async () => {
    try {
      const result = await axios({
        method: "POST",
        url: `/api/user/unfollow`,
        data: { userId },
        withCredentials: true,
        timeout: 5000,
      });

      if (result.status === 200) {
        setIsFollowing(false);
      }
    } catch (error) {
      console.error("언팔로잉 요청 중 오류:", error);
      alert("ERROR:언팔로잉 중 에러 발생");
    }
  };

  if (isErr) {
    return (
      <div className="fs-3 m-auto text-danger">
        <i className="bi bi-exclamation-diamond"></i>
        <br />
        프로필을 불러오는 중 오류가 발생하였습니다!
      </div>
    );
  } else
    return (
      <div class="m-2 text-center">
        <div>
          <p class="fw-bold fs-3 text-start mb-3">프로필</p>
        </div>
        <div className="d-flex flex-wrap">
          <div class="p-5 mx-auto">
            <img
              src={"/api/upload/profile/" + userData.user_image}
              alt=""
              width="100"
              height="100"
              className="rounded-circle bg-secondary-subtle object-fit-cover border"
            ></img>

            <p className="mx-auto my-1 fs-4 fw-bold">{userData.user_name}</p>
            <p>{userData.user_real_name}</p>
          </div>

          <div class="d-flex flex-column align-self-center text-center flex-fill px-auto">
            <div class="d-flex justify-content-between mb-4">
              <div class="col">
                <div class="p-3 fs-4">게시물</div>
                <div>0</div>
              </div>

              <div class="col">
                <div class="p-3 fs-4">팔로워 </div>
                <div>{followerCount}</div>
              </div>

              <div class="col">
                <div class="p-3 fs-4">팔로잉 </div>
                <div>{followingCount}</div>
              </div>
            </div>

            <div>
              {isFollowing === null ? (
                <Link to="/setting/infochange">
                  <button type="button" className="btn btn-secondary mx-3 my-2">
                    정보변경
                  </button>
                </Link>
              ) : isFollowing ? (
                <button
                  type="button"
                  className="btn btn-danger mx-3 my-2"
                  onClick={() => unFollowBtn()}
                >
                  팔로우 취소
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary mx-3 my-2"
                  onClick={() => followBtn()}
                >
                  팔로우
                </button>
              )}
            </div>
          </div>
        </div>
        <div>
          <hr />
          <div class="card mt-4" style={{ width: "18rem;" }}>
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
    );
};

export default Profile;
