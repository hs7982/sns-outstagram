import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const [currSearch, setCurrSearch] = useState("게시물");
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    performSearch()
  }, [currSearch]);

  const currKeyword = () => {
    switch (currSearch) {
      case "게시물":
        return "/api/posts/search/" + keyword;
      case "사용자":
        return "/api/user/search/" + keyword;
      case "태그":
        return "api/posts/tag/search/" + keyword;
      case "장소":
        return "api/posts/place/search/" + keyword;
      default:
        break;
    }
  };

  const performSearch = () => {
    if(keyword !== "") {
    axios({
      url: currKeyword(),
      method: "GET",
      withCredentials: true,
      timeout: 5000,
    })
      .then((result) => {
        console.log(result.data);
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
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div className="d-flex flex-column justify-content-between m-3"> {/* Set the container to take up the full height */}
      <div>
        <form className="d-flex align-items-center" role="search" onSubmit={handleSubmit}>
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
            style={{width: "5rem"}}
          >
            검색
          </button>
        </form>
        <div className="my-3 container text-center">
          <div className="d-flex">
            {["게시물", "사용자", "태그", "장소"].map((searchType) => (
              <div
                key={searchType}
                className={`flex-fill border-dark-subtle border-end ${
                  currSearch === searchType ? "active" : ""
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
          <p className="text-start my-3 fw-bold">{currSearch} 검색결과</p>
          {error && (
            <div className="alert alert-warning" role="alert">
              {error}
            </div>
          )}
          <div className="container">
            <div className="row row-cols-4" id="result">
              {searchResult.map((message) => (
                <div key={message.post_id} className="col p-3" style={{ width: "330px", height: "330px" }}>
                  <Link to={`/postView/${message.post_id}`}>
                    <img
                      src={`/api/upload/${JSON.parse(message.post_image_url)["0"]}`}
                      className="d-block object-fit-cover border rounded"
                      style={{ width: "330px", height: "330px" }}
                      alt=""
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Additional content or spacing can be added here */}
    </div>
  );
};

export default Search;
