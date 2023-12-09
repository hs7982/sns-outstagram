import React from "react";
import SettingNav from "./SettingNav";

const Setting = () => {
  return (
    <div className="d-flex flex-wrap" style={{ width: "100%" }}>
      <SettingNav />

      <div className="m-5 mx-auto">
        <img src="/setting.png" alt="setting" />
        <p className="fs-3">
          이 웹은 사용자들의 일상 공유 및 Online 의사소통을 위해 만들었습니다.
        </p>

        <p className="text-secondary">개발한 사람들 : 홍형석, 송성환, 서장원</p>
      </div>
    </div>
  );
};

export default Setting;
