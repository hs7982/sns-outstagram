import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import LikeList from "./LikeList";
import { UserContext } from "../../components/UserContext";
import { toast } from "react-toastify";

const Home = () => {
  const user = useContext(UserContext);
  const [postData, setPostData] = useState([]);
  const [isEmptyPost, setEmptyPost] = useState(false);
  const [isError, setError] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likeStatus, setLikeStatus] = useState({});
  const [likeCount, setLikeCount] = useState({});
  const [feedType, setFeedType] = useState("all");
  const [reload, setReload] = useState(false);
  const [lastPostId, setLastPostId] = useState();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [feedType, reload, page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = document.getElementById("top").scrollTop;
      sessionStorage.setItem("scrollPosition", scrollPosition);
      if (
        contentDiv.scrollTop + contentDiv.clientHeight ===
        contentDiv.scrollHeight
      ) {
        // 스크롤이 맨 아래에 도달하면 추가 데이터 로드

        if (!loadingMore) {
          setLoadingMore(true);
          setPage((prevPage) => prevPage + 1);
        } else console.log("데이터 로드중.. 추가 로드 방지");
      }
    };

    const contentDiv = document.getElementById("top");
    contentDiv.addEventListener("scroll", handleScroll);

    // 페이지 로드 시 저장된 스크롤 위치 불러오기
    const savedScrollPosition = sessionStorage.getItem("scrollPosition");

    // 스크롤 위치 설정을 setTimeout으로 처리하여 비동기 문제 해결
    setTimeout(() => {
      contentDiv.scrollTop = savedScrollPosition || 0;
    }, 100);
  }, []);

  const fetchData = async () => {
    console.log("게시물 데이터 로드 시작");
    console.log("추가로드 상태: " + loadingMore);
    console.log("로드 전 postdata: " + postData);
    console.log("로드 전 lastpostid: " + lastPostId);
    try {
      let url = "";
      if (feedType === "all") {
        url = "/api/posts/feed";
      } else if (feedType === "following") {
        url = "/api/posts/followFeed";
      }
      let request = {
        url: url,
        method: "GET",
        withCredentials: true,
        timeout: 5000,
      };

      if (!loadingMore) {
        console.log("추가로드 아니므로 상태 초기화");
        setPostData([]);
        setLastPostId(undefined);
        console.log("초기화 후 postdata: " + postData);
        console.log("초기화 후 lastpostid: " + lastPostId);
      } else {
        request.params = { lastPostId };
      }

      console.log(request);

      const result = await axios(request);

      if (result.status === 204) {
        if (lastPostId !== undefined) setNoMore(true);
        else setEmptyPost(true);
      } else {
        setEmptyPost(false);
        setPostData((prevData) => [...prevData, ...result.data]);

        // 각 게시물에 대한 초기 좋아요 상태를 가져옴
        for (const post of result.data) {
          const info = await getLikeInfo(post.post_id);
          const like = info.likeStatus;
          const count = info.likeCount;
          setLikeStatus((prevLikeStatus) => ({
            ...prevLikeStatus,
            [post.post_id]: like,
          }));
          setLikeCount((prevLikeCount) => ({
            ...prevLikeCount,
            [post.post_id]: count,
          }));
        }

        const lastId = result.data[result.data.length - 1].post_id;
        setLastPostId(lastId); // 마지막으로 받은 게시물의 ID를 상태에 저장
      }
    } catch (error) {
      setError(true);
      console.error("게시물을 불러오는 중 오류 발생:", error);
    } finally {
      setLoadingMore(false); // 데이터 로딩이 완료되면 로딩 중 상태를 false로 변경
    }
  };

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
        setLikeStatus((prevLikeStatus) => ({
          ...prevLikeStatus,
          [postId]: !liked,
        }));
        const count = await getLikeCount(postId);
        setLikeCount((prevLikeCount) => ({
          ...prevLikeCount,
          [postId]: count,
        }));
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

  const getLikeInfo = async (postId) => {
    try {
      const result = await axios({
        method: "GET",
        url: `/api/posts/like/info/${postId}`,
        withCredentials: true,
        timeout: 5000,
      });

      return result.data;
    } catch (error) {
      console.error("좋아요 정보를 가져오는 중 오류:", error);
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
          toast("🗑️ 게시물 삭제 완료", { type: "success" });
          setReload(!reload);
        } else {
          // 삭제 실패
          toast("ERROR:게시물 삭제 중 오류가 발생했습니다.", { type: "error" });
        }
      } catch (error) {
        if (error.code === "ERR_BAD_REQUEST") {
          toast("게시물을 삭제할 권한이 없습니다.", { type: "error" });
        } else {
          toast("ERROR:게시물 삭제 중 오류가 발생했습니다.", { type: "error" });
        }
      }
    } else {
    }
  };

  const changeFeedType = (e) => {
    //피드 타입 변경시 상태 초기화
    setLastPostId(undefined);
    setPostData([]);

    //초기화 후 피드타입 변경
    setFeedType(e);
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

  const scrollToTop = () => {
    const contentDiv = document.getElementById("top");
    contentDiv.scrollTop = 0;
  };

  if (isEmptyPost)
    return (
      <div>
        <div className="form-floating m-2" style={{ width: "13rem" }}>
          <select
            value={feedType}
            className="form-select"
            onChange={(e) => changeFeedType(e.target.value)}
          >
            <option value="all">✨ 모든 게시물</option>
            <option value="following">🙌 팔로우 중인 사람</option>
          </select>
          <label htmlFor="floatingSelect">피드 표시 방법</label>
        </div>
        <div className="fs-3 m-auto">
          <i className="bi bi-exclamation-diamond"></i>
          <br />
          표시할 게시물이 없습니다.
          <br />
          새로운 글을 업로드해보세요!
        </div>
      </div>
    );
  else if (isError)
    return (
      <div className="fs-3 m-auto text-danger">
        <i className="bi bi-exclamation-diamond"></i>
        <br />
        게시물을 불러오는 중 오류가 발생하였습니다!
      </div>
    );
  else
    return (
      <div className="mt-2" id="content" style={{ whiteSpace: "pre-wrap" }}>
        <div className="form-floating m-2" style={{ width: "13rem" }}>
          <select
            value={feedType}
            className="form-select"
            onChange={(e) => setFeedType(e.target.value)}
          >
            <option value="all">✨ 모든 게시물</option>
            <option value="following">🙌 팔로우 중인 사람</option>
          </select>
          <label htmlFor="floatingSelect">피드 표시 방법</label>
        </div>
        {postData.map((post, index) => {
          const imageUrls = parseImageUrls(post.post_image_url);
          const imageUrlArray = Object.values(imageUrls[0]); // Convert object values to array
          const like = likeStatus[post.post_id];
          const countL = likeCount[post.post_id];
          const modalId = `modal-${post.post_id}`;
          return (
            <div
              key={index}
              className="feed-item card text-start mx-auto mb-5 shadow-sm"
              style={{ width: "768px", maxWidth: "95%", maxHeight: "800px" }}
            >
              <div className="card-header d-flex bg-white">
                <div className="fw-bold mb-0 me-auto">
                  <Link
                    to={"/profile/" + post.post_user_id}
                    className="text-decoration-none text-dark"
                  >
                    <img
                      src={"/api/upload/profile/" + post.user_image}
                      alt=""
                      width="32"
                      height="32"
                      className="rounded-circle me-2 bg-secondary-subtle object-fit-cover border"
                    ></img>
                    {post.user_name}
                  </Link>
                </div>

                <div className="dropdown my-auto">
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
                      <Link
                        className="dropdown-item"
                        to={"/profile/" + post.post_user_id}
                      >
                        <i className="bi bi-person-circle"></i> 프로필 보기
                      </Link>
                    </li>
                    {post.post_user_id === user.user.userIdNo ? (
                      <div></div>
                    ) : (
                      ""
                    )}
                    {post.post_user_id === user.user.userIdNo ? (
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
                    ) : (
                      ""
                    )}
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
                      style={{ height: "400px" }}
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
                <div>
                  <Link className="text-decoration-none text-dark">
                    <span
                      className="fw-bold"
                      data-bs-toggle="modal"
                      data-bs-target={`#${modalId}`}
                    >
                      좋아요 {countL}개
                    </span>
                  </Link>
                  <LikeList postId={post.post_id} count={countL} />
                </div>
                <p className="card-text">{post.post_content}</p>
                <Link
                  to={"/postView/" + post.post_id}
                  className="text-secondary text-decoration-none"
                >
                  <i class="bi bi-chat-left-dots"></i>{" "}
                  <span>{post.comment_count}개의 댓글 보기</span>
                </Link>
              </div>
              <div className="card-footer">
                <small className="text-muted">
                  {getDateToKor(post.post_write_date)}
                </small>
              </div>
            </div>
          );
        })}
        {!noMore ? (
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div>더 이상 표시할 콘텐츠가 없습니다.</div>
        )}

        <button
          onClick={scrollToTop}
          className="btn btn-primary btn-floating shadow"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "1000",
          }}
        >
          <i className="bi bi-arrow-up-circle"></i>
        </button>
      </div>
    );
};

export default Home;
