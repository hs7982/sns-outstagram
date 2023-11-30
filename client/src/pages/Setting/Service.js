import React from "react";
import { Link } from "react-router-dom";
import SettingNav from "./SettingNav";

const Service = () => {
    return (
        <div className="d-flex flex-wrap" style={{width:'100%'}}>
          <SettingNav />
          <div className="m-5 mx-auto">
            <div className="fs-3">도움말</div>
            <div className="my-5">
              <p class="fs-3">무엇을 도와드릴까요?</p>
            </div>

            <form className="d-flex" role="search">
            <input
          className="form-control"
          type="search"
          placeholder="검색"
          aria-label="Search"
        />
             <Link><button
          className="btn btn-outline-success"
          type="submit"
          style={{ width: "5rem" }}
        >
          검색
        </button></Link>
        </form>
        <div>
        <p className="fw-bold">검색 예시:</p>

        <div>
        <p className="mx-auto">로그인이 안돼요.</p>
        <p>비밀번호를 변경하고 싶어요.</p>
        <p>팔로워를 차단하고싶어요.</p>
        <p>알림이 안울리게 해주세요.</p>
        <p>문의하기.</p>
              </div>
            </div>
          </div>
          
        </div>
      );
    };

export default Service;