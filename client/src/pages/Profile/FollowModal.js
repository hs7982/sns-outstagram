import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LikeList = ({ userId, type, count }) => {
  const [followList, setFollowList] = useState([]);
  const [isEmptyData, setIsEmptyData] = useState(false);

  const getFollowList = async (userId) => {
    try {
      const result = await axios({
        method: "GET",
        url: `/api/user/${type}List/${userId}`,
        withCredentials: true,
        timeout: 5000,
      });

      if (result.status === 200) {
        setFollowList(result.data);
        setIsEmptyData(false);
      } else if (result.status === 204) {
        setFollowList([]);
        setIsEmptyData(true);
      }
    } catch (error) {
      console.error(type, " 목록를 가져오는 중 오류: ", error);
    }
  };

  useEffect(() => {
    getFollowList(userId);
  }, [count]);

  const link = (user) => {
    window.open("/profile/" + user, "_self");
  };
  if (isEmptyData) {
    return (
      <div
        className="modal fade"
        id={type}
        tabIndex="-1"
        aria-labelledby="팔로우/팔로워 목록 모달"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {type === "follower" ? "팔로워 목록" : "팔로잉 목록"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>표시할 사용자가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal fade modal-dialog-scrollable"
      id={type}
      tabIndex="-1"
      aria-labelledby="팔로우/팔로워 목록 모달"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {type === "follower" ? "팔로우 목록" : "팔로잉 목록"}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-start">
            <ul className="list-group list-group-flush">
              {followList.map((user) => (
                <li key={user.like_user_id} className="list-group-item">
                  <div className="d-flex">
                    <img
                      src={`/api/upload/profile/${user.user_image}`}
                      alt=""
                      width="32"
                      height="32"
                      className="rounded-circle me-2 my-auto bg-secondary-subtle object-fit-cover border"
                    />
                    <div>
                      <div className="fw-bold">{user.user_name}</div>
                      <small>{user.user_real_name}</small>
                    </div>

                    <button
                      className="btn btn-primary btn-sm ms-auto my-auto"
                      data-bs-dismiss="modal"
                      onClick={() =>
                        link(
                          type === "follower"
                            ? user.user_id
                            : user.followed_user_id
                        )
                      }
                    >
                      프로필보기
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikeList;
