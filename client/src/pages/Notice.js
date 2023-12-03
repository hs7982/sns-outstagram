import React from "react";
import { Link } from "react-router-dom";

const Notice = () => {
  return (
    <div class="container px-4 text-center overflow-auto">
      <div>
        <p class="fw-bold fs-4 d-flex flex-row mb-3">알림</p>
      </div>

      <div class="p-2">
        오늘
      </div>

      <div class="p-3">
        <img src="/3.jpg" class="object-fit-cover d-block w-10" alt="..." />
        홍길동 @gildong_hong 님이 프로필 사진을 변경했습니다.
        <Link>
          <div>
            <button type="button" class="my-4 btn btn-secondary">
              프로필 보기
            </button>
          </div>
        </Link>
      </div>
      <div class="d-flex flex-column mb-3">
        <hr></hr>
      </div>

      <div class="p-2">어제</div>
      <div class="p-3">
        <img src="/seo.png" class="object-fit-cover d-block w-20" alt="..." />
        서장원 @jangwon_seo 님이 팔로우를 요청하였습니다.
      </div>
      <Link>
        <div>
          <button type="button" class="btn btn-secondary">
            팔로우
          </button>
        </div>
      </Link>
      <hr></hr>

      <div class="p-2">
        일주일 전
        <img src="/new.png" class="object-fit-cover d-block w-20" alt="..." />
        <div class="p-3">
          뉴진스 @newjeans_official 님이 게시물을 올렸습니다
        </div>
        <Link>
          <button type="button" class="btn btn-secondary">
            게시물 보기
          </button>
        </Link>
        <hr></hr>
      </div>
    </div>
  );
};

export default Notice;
