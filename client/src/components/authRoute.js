import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Auth(SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      axios({
        url: "/api/user/myInfo",
        method: "GET",
        withCredentials: true,
        timeout: "10000",
      }).then((response) => {
        setLoading(false);

        if (!response.data.isLogin) {
          //로그인X
          if (option) {
            //(true)인증이 필요한 페이지: api 호출결과 로그인상태X -> /login으로 이동처리
            toast("로그인이 필요합니다.", {
              type: "warning",
            });
            navigate("/login");
          }
        } else {
          //로그인O
          if (adminRoute && !response.data.isAdmin) {
            //Admin라우트: Admin권한 없을때 -> /로 이동처리
            navigate("/");
          } else {
            // if (location.pathname === "/login") {
            //   window.open("/", "_self");
            // }
            // 추가적인 조건을 통해 다른 인증이 필요한 페이지 처리 가능
            // else if (option && location.pathname === "/someOtherAuthPage") {
            //   navigate(location.pathname);
            // }
          }
        }
      });
    }, [location.pathname, navigate, option, adminRoute]);

    if (loading) {
      // 로딩 중일 때의 UI를 반환
      return (
        <div className="text-center m-auto">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    // 인증 확인이 완료된 후에만 SpecificComponent를 반환
    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}

export default Auth;
