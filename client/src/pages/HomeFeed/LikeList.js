import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LikeList = ({ postId, count }) => {
  const [likeList, setLikeList] = useState([]);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const modalId = "modal-" + postId;

  const getLikeList = async (postId) => {
    try {
      const result = await axios({
        method: "GET",
        url: `/api/posts/like/list/${postId}`,
        withCredentials: true,
        timeout: 5000,
      });

      if (result.status === 200) {
        setLikeList(result.data);
        setIsEmptyData(false);
      } else if (result.status === 204) {
        setLikeList([]);
        setIsEmptyData(true);
      }
    } catch (error) {
      console.error("좋아요 정보를 가져오는 중 오류:", error);
    }
  };

  useEffect(() => {
    getLikeList(postId);
  }, [postId, count]);

  if (isEmptyData) {
    return (
      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                이 게시물을 좋아하는 사람
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>이 게시물을 좋아한 사용자가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal fade modal-dialog-scrollable"
      id={modalId}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              이 게시물을 좋아하는 사람
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <ul className="list-group list-group-flush">
              {likeList.map((user) => (
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
                    <Link to={"/profile/"+user.like_user_id} className="ms-auto my-auto">
                    <button className="btn btn-primary btn-sm" data-bs-dismiss="modal">
                      프로필보기
                    </button>
                    </Link>
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
