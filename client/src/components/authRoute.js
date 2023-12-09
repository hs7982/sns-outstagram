import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

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
          if (option) {
            navigate("/login");
          }
        } else {
          if (adminRoute && !response.data.isAdmin) {
            navigate("/"); // 이 부분을 수정하여 다른 경로로 이동하도록 변경 가능
          } else {
            // 인증이 필요한 페이지에 접근할 때 해당 페이지로 유지
            if (option && location.pathname === "/login") {
              navigate(location.pathname);
            }
            // 추가적인 조건을 통해 다른 인증이 필요한 페이지 처리 가능
            // else if (option && location.pathname === "/someOtherAuthPage") {
            //   navigate(location.pathname);
            // }
          }
        }
      });
    }, [location.pathname, navigate, option, adminRoute]);

    if (loading) {
      // 로딩 중일 때의 UI를 반환할 수 있습니다.
      return (
        <div class="text-center m-auto">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    // 인증 확인이 완료된 후에만 SpecificComponent를 반환합니다.
    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}

export default Auth;
