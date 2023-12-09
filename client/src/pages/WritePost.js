import React, { useState, useEffect } from "react";
import axios from "axios";

const WritePost = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImagesURL, setSelectedImagesURL] = useState([]);
  const [content, setContent] = useState("");

  const appendAlert = (message, type) => {
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    alertPlaceholder.innerHTML = [
      `<div className="alert alert-${type} alert-dismissible fade show" role="alert">`,
      `   <div><i className="bi bi-exclamation-triangle-fill"></i> ${message}</div>`,
      '   <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
  };

  const onSelectFile = (e) => {
    e.preventDefault();
    const selectedFiles = e.target.files;
    const fileUrlList = [];
    const fileList = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const nowUrl = URL.createObjectURL(selectedFiles[i]);
      fileList.push(selectedFiles[i]);
      fileUrlList.push(nowUrl);
    }

    setSelectedImagesURL((prevURLs) => [...prevURLs, ...fileUrlList]);
    setSelectedFiles((prevFiles) => [...prevFiles, ...fileList]);

    e.target.value = "";
  };

  const attachFile =
    selectedImagesURL &&
    selectedImagesURL.map((url, index) => (
      <div key={index}>
        <div>
          <a href={url} target="_blank" rel="noreferrer">
            <img
              src={url}
              alt="업로드파일"
              className="object-fit-contain border rounded mx-1"
              height="100px"
            />
          </a>
        </div>
        <div>
          <button
            className="btn btn-outline-danger btn-sm my-2"
            onClick={() => {
              setSelectedImagesURL((prevURLs) =>
                prevURLs.filter((_, i) => i !== index)
              );
              setSelectedFiles((prevFiles) =>
                prevFiles.filter((_, i) => i !== index)
              );
            }}
          >
            삭제
          </button>
        </div>
      </div>
    ));

  const postSubmit = async () => {
    if (selectedFiles.length > 0 && content.trim() !== "") {
      try {
        const formData = new FormData();
        formData.append("content", content);

        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("PostImages", selectedFiles[i]);
        }

        await axios.post("/api/posts/new", formData, {
          withCredentials: true,
          timeout: 5000,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        appendAlert("게시물이 성공적으로 업로드되었습니다.", "info");
        alert("게시물이 성공적으로 업로드되었습니다.");
        window.open("/", "_self");

        // 업로드 후 상태 초기화
        setSelectedFiles([]);
        setSelectedImagesURL([]);
        setContent("");
      } catch (error) {
        appendAlert(
          "게시물 작성 중 오류가 발생하였습니다<br/>" + error.response.data,
          "danger"
        );
      }
    } else {
      appendAlert("업로드할 사진과 내용을 모두 입력해주세요.", "warning");
    }
  };

  return (
    <div className="m-4">
      <div className="mb-5">
        <h2>게시물 업로드</h2>
      </div>
      <div className="" style={{ width: "100%" }}>
        <p className="text-start">업로드할 사진을 선택해주세요.</p>
        <input
          type="file"
          className="form-control mb-3"
          accept="image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime"
          id="inputGroupFile04"
          onChange={onSelectFile}
          aria-describedby="inputGroupFileAddon04"
          multiple
        />
        {selectedImagesURL.length !== 0 ? (
          <div className="d-flex flex-row overflow-auto">{attachFile}</div>
        ) : null}
        <hr />
        <p className="text-start mt-3">게시물 내용</p>
        <textarea
          id="inputPassword5"
          className="form-control mb-3"
          rows={10}
          onChange={(e) => setContent(e.target.value)}
        />
        <div id="liveAlertPlaceholder"></div>
        <button
          className="btn btn-primary mt-5"
          type="button"
          id="inputGroupFileAddon04"
          onClick={postSubmit}
        >
          게시하기
        </button>
      </div>
    </div>
  );
};

export default WritePost;
