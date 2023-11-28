import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const setResult = (message) => {
  const alertPlaceholder = document.getElementById("result");
  alertPlaceholder.innerHTML = "";

  // Iterate through the messages array
  message.forEach((message) => {
    // Create a div element for each message
    const messageDiv = document.createElement("div");

    // Extracting properties from the message object
    const postContent = message.post_content;
    const postImage = JSON.parse(message.post_image_url)["0"];
    const postWriteDate = message.post_write_date;

    // Construct the HTML for each message
    const messageHTML = `<div className="col p-3" style={{ width: "330px", height:"330px"}}>
    <a href="/postView/${message.post_id}">
      <img
                        src="/api/upload/${postImage}"
                        className="d-block object-fit-cover border rounded"
                        style="width: 330px; height: 330px;"
                      /></img>
        </a>
      </div>
    `;

    // Set the innerHTML of the message div
    messageDiv.innerHTML = messageHTML;

    // Append the message div to the alertPlaceholder
    alertPlaceholder.appendChild(messageDiv);
  });
};

const setErrResult = (message, type) => {
  const alertPlaceholder = document.getElementById("result");
  alertPlaceholder.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
    `   <div><i class="bi bi-exclamation-triangle-fill"></i> ${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");
};

const Search = () => {
  const [currSearch, setCurrSearch] = useState("post");
  const [keyword, setKeyword] = useState("");

  const currKeyword = () => {
    switch (currSearch) {
      case "post":
        return "/api/posts/search/" + keyword;
      case "user":
        return "/api/user/search/" + keyword;
      case "tag":
        return "api/posts/search/" + keyword;
      case "place":
        return "api/posts/search/" + keyword;
      default:
        break;
    }
  };

  const Search = () => {
    axios({
      url: currKeyword(),
      method: "GET",
      withCredentials: true,
      timeout: 5000,
    })
      .then((result) => {
        console.log(result.data);
        if (result.status === 204) {
          setErrResult("검색 결과가 없습니다.", "warning");
        } else if (result.status === 200) {
          setResult(result.data);
        }
      })
      .catch((error) => {});
  };

  return (
    <div className="m-4 overflow-auto" style={{ width: "100%" }}>
      <form className="d-flex overflow-auto" role="search">
        <input
          className="form-control"
          type="search"
          placeholder="검색어 입력"
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="Search"
        />
        <Link>
          <button
            className="btn btn-outline-success"
            type="submit"
            onClick={() => Search()}
            style={{ width: "5rem" }}
          >
            검색
          </button>
        </Link>
      </form>
      <div>
        <div class="my-3 container text-center">
          <div class="d-flex">
            <div class="flex-fill border-dark-subtle border-end">
              <Link
                className="mx-auto text-dark text-decoration-none"
                onClick={() => setCurrSearch("post")}
              >
                게시물
              </Link>
            </div>
            <div class="flex-fill  border-dark-subtle border-end">
              <Link
                className="mx-auto text-dark text-decoration-none"
                onClick={() => setCurrSearch("tag")}
              >
                태그
              </Link>
            </div>
            <div class="flex-fill border-dark-subtle border-end">
              <Link
                className="mx-auto text-dark text-decoration-none"
                onClick={() => setCurrSearch("user")}
              >
                사람
              </Link>
            </div>
            <div class="flex-fill">
              <Link
                className="mx-auto text-dark text-decoration-none"
                onClick={() => setCurrSearch("place")}
              >
                장소
              </Link>
            </div>
          </div>
        </div>
        <div>
          <p className="text-start my-3 fw-bold">검색결과</p>
          <div className="container"><div className="row row-cols-4" id="result"></div></div>
          
        </div>

        

        
      </div>
    </div>
  );
};

export default Search;
