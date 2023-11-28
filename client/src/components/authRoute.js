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
            navigate(location.pathname);
          } else {
            if (!option) {
              navigate(location.pathname);
            }
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
