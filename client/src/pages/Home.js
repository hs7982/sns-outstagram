import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [postData, setPostData] = useState([]);
  const [isEmptyPost, setEmptyPost] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    axios({
      url: "/api/posts/feed",
      method: "GET",
      withCredentials: true,
      timeout: 5000,
    })
      .then((result) => {
        if (result.status === 204) setEmptyPost(true);
        else setPostData(result.data);
      })
      .catch((error) => {
        setError(true);
        console.error("게시물을 불러오는 중 오류 발생:", error);
      });
  }, []);

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
  if (isEmptyPost)
    return (
      <div className="fs-3 m-auto">
        <i className="bi bi-exclamation-diamond"></i>
        <br />
        표시할 게시물이 없습니다.<br/>새로운 글을 업로드해보세요!
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
      <div
        className="mx-auto overflow-y-auto"
        id="content"
        style={{ width: "100%", whiteSpace: "pre-wrap" }}
      >
        {postData.map((post, index) => {
          const imageUrls = parseImageUrls(post.post_image_url);
          const imageUrlArray = Object.values(imageUrls[0]); // Convert object values to array
          return (
            <div
              key={index}
              className="feed-item card text-start mx-auto my-5 shadow-sm"
              style={{ width: "768px" }}
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
                      <Link className="dropdown-item" to="">
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
                      style={{ height: "432px" }}
                    >
                      <img
                        src={`/api/upload/${imageUrl}`}
                        className="d-block object-fit-contain h-100 mx-auto"
                        alt={`Slide ${imageIndex + 1}`}
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
              <div className="card-body">
                <span className="mb-3">
                  <i className="bi bi-suit-heart fs-4"></i>{" "}
                  <i className="bi bi-send fs-4 mx-1"></i>
                </span>
                <p className="fw-bold">좋아요 0개</p>
                <p className="card-text">{post.post_content}</p>
              </div>
              <div className="card-footer">
                <small className="text-muted">
                  {getDateToKor(post.post_write_date)}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    );
};

export default Home;
