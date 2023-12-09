import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const [currSearch, setCurrSearch] = useState("게시물");
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    performSearch();
    console.log(searchResult);
  }, [currSearch]);

  const currKeyword = () => {
    switch (currSearch) {
      case "게시물":
        return "/api/posts/search/" + keyword;
      case "댓글":
        return "api/posts/searchComment/" + keyword;
      case "사용자":
        return "/api/user/searchUser/" + keyword;
      default:
        break;
    }
  };

  const performSearch = () => {
    if (keyword !== "") {
      setIsLoading(true);
      axios({
        url: currKeyword(),
        method: "GET",
        withCredentials: true,
        timeout: 5000,
      })
        .then((result) => {
          if (result.status === 204) {
            setError("검색 결과가 없습니다.");
            setSearchResult([]);
          } else if (result.status === 200) {
            setError(null);
            setSearchResult(result.data);
          }
        })
        .catch(() => {
          setError("검색 중 오류가 발생했습니다.");
          setSearchResult([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSearchResult([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword === "") {
      setError("검색어를 입력하세요.");
    }
    performSearch();
  };

  return (
    <div className="d-flex flex-column justify-content-between m-3">
      {" "}
      {/* Set the container to take up the full height */}
      <div>
        <form
          className="d-flex align-items-center"
          role="search"
          onSubmit={handleSubmit}
        >
          <input
            className="form-control"
            type="search"
            placeholder="검색어 입력"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="Search"
          />
          <button
            className="btn btn-outline-success"
            type="submit"
            style={{ width: "5rem" }}
          >
            검색
          </button>
        </form>
        <div className="py-3 my-3 mx-5 text-center bg-body-tertiary rounded-pill border-light-subtle border">
          <div className="d-flex">
            <div className="d-none d-md-block border-dark-subtle border-end fs-5 my-auto text-end px-5">
              검색 항목
            </div>
            {["게시물", "댓글", "사용자"].map((searchType) => (
              <div
                key={searchType}
                className={`flex-fill ${
                  currSearch === searchType ? "fw-bold" : ""
                }`}
              >
                <Link
                  className="mx-auto text-dark text-decoration-none"
                  onClick={() => setCurrSearch(searchType)}
                >
                  {searchType}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-start my-3 fs-4">{currSearch} 검색결과</p>
          {error && (
            <div className="alert alert-warning mx-5" role="alert">
              <i className="bi bi-exclamation-triangle-fill"> </i>
              {error}
            </div>
          )}

          {isLoading ? (
            <div>로딩 중...</div>
          ) : (
            <Fragment>
              {currSearch === "게시물" ? (
                <div className="container">
                  <div className="row row-cols-4" id="result">
                    {searchResult.map((message) => (
                      <div
                        key={message.post_id}
                        className="col p-3"
                        style={{ width: "330px", height: "330px" }}
                      >
                        <Link to={`/postView/${message.post_id}`}>
                          {message.post_image_url && (
                            <img
                              src={`/api/upload/${
                                JSON.parse(message.post_image_url)["0"]
                              }`}
                              className="d-block object-fit-cover border rounded"
                              style={{ width: "330px", height: "330px" }}
                              alt=""
                            />
                          )}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {currSearch === "댓글" ? (
                <div className="container">
                  <div className="row row-cols-4 justify-content-center" id="result">
                    {searchResult.map((message) => (
                      <div
                        key={message.comment_content}
                        className="col p-3 border rounded m-1 overflow-y-auto"
                        style={{ width: "230px", height: "210px" }}
                      >
                        <Link
                          to={`/postView/${message.comment_post_id}`}
                          className="text-decoration-none text-dark"
                        >
                          <img
                            src={`/api/upload/profile/${message.user_image}`}
                            width="100"
                            height="100"
                            className="rounded-circle bg-secondary-subtle object-fit-cover border"
                            alt=""
                          />

                          <div className="mt-1">{message.user_name}</div>
                          <div className="fst-italic">
                            "{message.comment_conent}"
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {currSearch === "사용자" ? (
                <div className="container">
                  <div className="row row-cols-4 justify-content-center" id="result">
                    {searchResult.map((message) => (
                      <div
                        key={message.user_name}
                        className="col p-3 border rounded m-1 overflow-y-auto"
                        style={{ width: "230px", height: "210px" }}
                      >
                        <Link 
                          to={`/profile/${message.user_id_no}`}
                          className="text-decoration-none text-dark"
                          >
                        <img
                            src={`/api/upload/profile/${message.user_image}`}
                            width="100"
                            height="100"
                            className="rounded-circle bg-secondary-subtle object-fit-cover border"
                            alt=""
                          />                       

                          <div className="mt-1">{message.user_name}</div>
                          <div className="fst-italic">
                          {message.user_real_name}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

            </Fragment>
          )}
        </div>
      </div>
      {/* Additional content or spacing can be added here */}
    </div>
  );
};

export default Search;
