import React from "react";
import { Link } from "react-router-dom";

const Notice = () => {
  return (
    <div className="container px-4 mt-3 text-center overflow-auto">
      <div>
        <p className="fw-bold fs-4 d-flex flex-row mb-3">알림</p>
      </div>

      <div>
        <p className="fs-4">오늘</p>
        <div className="d-flex flex-wrap w-100">
          <img
            src="/api/upload/profile/e0dbda74-644c-4c42-b190-b2b0656cf8ab.png"
            width="75"
            height="75"
            className="rounded-circle bg-secondary-subtle object-fit-cover border"
            alt="..."
          />
          <div className="flex-fill my-auto">
            <div className="ms-4 text-start">
              <b>홍길동 @gildong_hong</b> 님이 프로필 사진을 변경했습니다.
            </div>
          </div>
          <Link className="my-auto">
            <button type="button" className="btn btn-secondary">
              프로필 보기
            </button>
          </Link>
        </div>
      </div>

      <hr></hr>

      <div>
        <p className="fs-4">어제</p>
        <div className="d-flex flex-wrap w-100">
          <img
            src="/api/upload/profile/e0dbda74-644c-4c42-b190-b2b0656cf8ab.png"
            width="75"
            height="75"
            className="rounded-circle bg-secondary-subtle object-fit-cover border "
            alt="..."
          />
          <div className="flex-fill my-auto">
            <div className="ms-4 text-start">
              <b>서장원 @jangwon_seo</b> 님이 팔로우를 요청하였습니다.
            </div>
          </div>
          <Link className="my-auto">
            <button type="button" className="btn btn-secondary">
              수락
            </button>
          </Link>
        </div>
        <div className="d-flex flex-wrap w-100 mt-4">
          <img
            src="/api/upload/profile/e0dbda74-644c-4c42-b190-b2b0656cf8ab.png"
            width="75"
            height="75"
            className="rounded-circle bg-secondary-subtle object-fit-cover border"
            alt="..."
          />
          <div className="flex-fill my-auto">
            <div className="ms-4 text-start">
              <b>홍길동 @gildong_hong</b> 님이 팔로우 하였습니다.
            </div>
          </div>
          <Link className="my-auto">
            <button type="button" className="btn btn-secondary">
              맞팔로우
            </button>
          </Link>
        </div>

        <hr></hr>

        <div>
          <p className="fs-4">일주일 전</p>
          <div className="d-flex flex-wrap w-100">
            <img
              src="/api/upload/profile/e0dbda74-644c-4c42-b190-b2b0656cf8ab.png"
              width="75"
              height="75"
              className="rounded-circle bg-secondary-subtle object-fit-cover border"
              alt="..."
            />
            <div className="flex-fill my-auto">
              <div className="ms-4 text-start">
                <b>뉴진스 @newjeans_official</b> 님이 게시물을 올렸습니다
              </div>
            </div>
            <Link className="my-auto">
              <button type="button" className="btn btn-secondary">
                게시물 보기
              </button>
            </Link>
          </div>
          <hr></hr>
        </div>
      </div>
    </div>
  );
};

export default Notice;
