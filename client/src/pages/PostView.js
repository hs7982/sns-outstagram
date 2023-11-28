import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const PostView = () => {
  const params = useParams();
  const [postData, setPostData] = useState([]);
  const [isError, setError] = useState(false);
  const [noPost, setNoPost] = useState(false);
  const [likeStatus, setLikeStatus] = useState();
  const [likeCount, setLikeCount] = useState();
  const [CommentList, setCommentList] = useState({});
  const [comment, setComment] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postId = params.postId;
        const result = await axios({
          url: "/api/posts/post/" + postId,
          method: "GET",
          withCredentials: true,
          timeout: 5000,
        });

        setPostData(result.data);
        setLikeStatus(await getLike(postId));
        setLikeCount(await getLikeCount(postId));
        setCommentList(await getComment(postId));
      } catch (error) {
        if (error.code === "ERR_BAD_REQUEST") setNoPost(true);
        else setError(true);
        console.log("게시물을 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  const likeClick = (postId, liked) => {
    let methods = "";
    if (!liked) {
      methods = "POST";
    } else {
      methods = "DELETE";
    }

    axios({
      method: methods,
      url: `/api/posts/like/${postId}`,
      withCredentials: true,
      timeout: 5000,
    })
      .then(async (result) => {
        console.log("성공", result);
        setLikeStatus(!liked);
        const count = await getLikeCount(postId);
        setLikeCount(count);
      })
      .catch((error) => {
        console.error("게시물 좋아요 중 오류:", error);
      });
  };

  const getLike = async (postId) => {
    try {
      const result = await axios({
        method: "GET",
        url: `/api/posts/like/${postId}`,
        withCredentials: true,
        timeout: 5000,
      });

      return result.data; // true 또는 false 반환
    } catch (error) {
      console.error("좋아요 정보를 가져오는 중 오류:", error);
      return false; // 에러 발생 시 기본값으로 false 반환
    }
  };

  const getLikeCount = async (postId) => {
    try {
      const result = await axios({
        method: "GET",
        url: `/api/posts/like/count/${postId}`,
        withCredentials: true,
        timeout: 5000,
      });

      return result.data; //number반환
    } catch (error) {
      console.error("좋아요 정보를 가져오는 중 오류:", error);
      return false; // 에러 발생 시 기본값으로 false 반환
    }
  };

  const getComment = async (postId) => {
    try {
      const result = await axios({
        method: "GET",
        url: `/api/posts/comment/${postId}`,
        withCredentials: true,
        timeout: 5000,
      });

      return result.data;
    } catch (error) {
      console.error("댓글을 가져오는 중 오류:", error);
      return false; // 에러 발생 시 기본값으로 false 반환
    }
  };

  const parseImageUrls = (imageUrls) => {
    try {
      const urls = JSON.parse(imageUrls);
      if (Array.isArray(urls)) {
        return urls;
      } else {
        return [urls];
      }
    } catch (error) {
      console.error("이미지 URL을 파싱하는 중 오류 발생:", error);
      return [];
    }
  };

  const getDateToKor = (date) => {
    date = new Date(date);
    return (
      date.getFullYear() +
      "년 " +
      (date.getMonth() + 1) +
      "월 " +
      date.getDate() +
      "일 " +
      date.getHours() +
      "시 " +
      date.getMinutes() +
      "분 " +
      date.getSeconds() +
      "초 " +
      "일월화수목금토".charAt(date.getUTCDay()) +
      "요일"
    );
  };

  const deletePost = async (postId) => {
    if (window.confirm("정말 이 게시물을 삭제할까요?")) {
      try {
        const result = await axios({
          method: "DELETE",
          url: `/api/posts/post/${postId}`,
          withCredentials: true,
          timeout: 5000,
        });

        if (result.status === 200) {
          // 삭제 성공
          alert("게시물이 성공적으로 삭제되었습니다.");
          window.location.reload();
        } else {
          // 삭제 실패
          alert("ERROR:게시물 삭제 중 오류가 발생했습니다.");
        }
      } catch (error) {
        if (error.code === "ERR_BAD_REQUEST") {
          alert("게시물을 삭제할 권한이 없습니다.");
        } else {
          console.error("게시물을 삭제하던 중 오류:", error);
          alert("게시물 삭제 중 오류가 발생했습니다.");
        }
      }
    } else {
    }
  };

  const postComment = async () => {
    if (comment) {
      const postId = params.postId;
      try {
        const result = await axios({
          method: "POST",
          url: `/api/posts/comment`,
          withCredentials: true,
          timeout: 5000,
          data: {
            postId: postId,
            content: comment,
          },
        });

        if (result.status === 201) {
          window.location.reload();
        } else {
          alert("ERROR:댓글 작성중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("댓글을 작성하는 중 오류:", error);
        alert("댓글 작성중 오류가 발생했습니다.");
      }
    } else alert("내용을 입력하세요.");
  };

  const copyClipBoard = (text) => {
    try {
      navigator.clipboard.writeText(text);
      alert(
        "공유 링크가 클립보드에 복사되었습니다.\n공유할 곳에 붙여넣어보세요."
      );
    } catch (err) {
      alert("클립보드 복사에 실패하였습니다." + err);
    }
  };

  if (isError)
    return (
      <div className="fs-3 m-auto text-danger">
        <i className="bi bi-exclamation-diamond"></i>
        <br />
        게시물을 불러오는 중 오류가 발생하였습니다!
      </div>
    );
  else if (noPost)
    return (
      <div className="fs-3 m-auto text-danger">
        <i className="bi bi-exclamation-diamond"></i>
        <br />
        삭제되었거나 없는 게시물입니다.
      </div>
    );
  else
    return (
      <div
        className=""
        id="content"
        style={{
          width: "100%",
          whiteSpace: "pre-wrap",
          overflowY: "scroll",
          maxHeight: "100vh",
        }}
      >
        <div className="my-4">
          <h2>게시물 상세보기</h2>
        </div>
        {postData.map((post, index) => {
          const imageUrls = parseImageUrls(post.post_image_url);
          const imageUrlArray = Object.values(imageUrls[0]); // Convert object values to array
          const like = likeStatus;
          const countL = likeCount;
          return (
            <div className="card-group m-3" key={index}>
              <div
                className="feed-item card text-start mx-auto mx-5 shadow-sm"
                style={{ width: "768px", maxWidth: "100%", height: "80vh" }}
              >
                <div className="card-header d-flex">
                  <div className="fw-bold mb-0 me-auto">
                    <img
                      src={"/api/upload/profile/" + post.user_image}
                      alt=""
                      width="32"
                      height="32"
                      className="rounded-circle me-2 bg-secondary-subtle object-fit-cover border"
                    ></img>
                    {post.user_name}
                  </div>
                  <div className="dropdown">
                    <Link
                      href="#"
                      className="d-flex align-items-center text-black text-decoration-none"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-three-dots"></i>
                    </Link>

                    <ul className="dropdown-menu dropdown-menu text-small shadow">
                      <li>
                        <Link className="dropdown-item" to="">
                          <i className="bi bi-pencil-square"></i> 수정
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          onClick={() => deletePost(post.post_id)}
                        >
                          <span className="text-danger">
                            <i className="bi bi-trash"></i> 게시물 삭제
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="">
                          <i className="bi bi-flag"></i> 이 게시물 신고하기
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  id={`carouselExampleIndicators${index}`}
                  className="carousel slide"
                >
                  <div className="carousel-inner border-bottom">
                    {imageUrlArray.map((imageUrl, imageIndex) => (
                      <div
                        key={imageIndex}
                        className={`carousel-item${
                          imageIndex === 0 ? " active" : ""
                        }`}
                        style={{ height: "50vh" }}
                      >
                        <img
                          src={`/api/upload/${imageUrl}`}
                          className="d-block object-fit-contain h-100 mx-auto"
                          alt={`Slide ${imageIndex + 1}`}
                          style={{ width: "100%" }}
                        />
                      </div>
                    ))}
                  </div>

                  {imageUrlArray.length > 1 && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target={`#carouselExampleIndicators${index}`}
                        data-bs-slide="prev"
                      >
                        <span
                          className="bi-arrow-left-circle-fill text-dark"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">이전</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#carouselExampleIndicators${index}`}
                        data-bs-slide="next"
                      >
                        <span
                          className="bi-arrow-right-circle-fill text-dark"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">다음</span>
                      </button>
                    </>
                  )}
                </div>
                <div className="card-body overflow-y-auto">
                  <span className="mb-3">
                    <i
                      className={
                        like
                          ? "bi bi-suit-heart-fill fs-4 text-danger"
                          : "bi bi-suit-heart fs-4"
                      }
                      onClick={() => likeClick(post.post_id, like)}
                    ></i>{" "}
                    <i
                      className="bi bi-send fs-4 mx-1"
                      onClick={() =>
                        copyClipBoard(
                          "http://43.202.142.114:3000/postView/" + post.post_id
                        )
                      }
                    ></i>
                  </span>
                  <p className="fw-bold">좋아요 {countL}개</p>

                  <p className="card-text ">{post.post_content}</p>
                </div>
                <div className="card-footer">
                  <small className="text-muted">
                    {getDateToKor(post.post_write_date)}
                  </small>
                </div>
              </div>
              <div
                key={index}
                className="feed-item card text-start mx-auto mx-5 shadow-sm"
                style={{ width: "768px", maxWidth: "100%", height: "80vh" }}
              >
                <div className="card-header d-flex bg-transparent">
                  <span className="fs-5">이 게시물의 댓글</span>
                </div>
                <div className="card-body h-100 overflow-y-auto">
                  {Array.isArray(CommentList) && CommentList.length > 0 ? (
                    CommentList.map((oneComment, index) => (
                      <div key={index} className="d-flex mb-3">
                        <img
                          src={`/api/upload/profile/${oneComment.user_image}`}
                          alt=""
                          width="32"
                          height="32"
                          className="rounded-circle me-2 bg-secondary-subtle object-fit-cover border"
                        />
                        <div>
                          <div className="fw-bold">{oneComment.user_name}</div>
                          <p className="mx-2">{oneComment.comment_conent}</p>
                          <small className="text-muted">
                            {getDateToKor(oneComment.comment_time)}
                          </small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="my-auto text-center">
                      아직 작성된 댓글이 없습니다.
                    </p>
                  )}
                </div>
                <div className="card-footer input-group flex-nowra bg-transparent">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="댓글을 입력하세요."
                    onChange={(e) => setComment(e.target.value)}
                  ></input>
                  <button
                    type="submit"
                    className="btn btn-primary "
                    onClick={() => postComment()}
                  >
                    작성
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
};

export default PostView;
