import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../components/UserContext";
import SettingNav from "./SettingNav";

const InfoChange = () => {
  const user = useContext(UserContext);
  const [userRelName, setUserRelName] = useState();
  const [userName, setUserName] = useState(user.user.userName);
  const [userTel, setUserTel] = useState();
  return (
    //성명, 사용자 이름, 전화번호 변경
    <div className="d-flex" style={{ width: "100%" }}>
      <SettingNav />
      <div className="overflow-y-auto my-3 w-auto mx-auto">
        <div className="fs-3">정보 변경</div>

        <div>
          <div className="m-5">
            <div className="mb-4">
              <p className="text-start">프로필 사진</p>
              <div className="d-flex">
              <img
                src={"/api/upload/profile/" + user.user.userProfileImg}
                alt=""
                width="100"
                height="100"
                className="rounded-circle me-2 bg-secondary-subtle object-fit-cover border"
              ></img><input type="file" className="form-control align-self-center ms-2" accept="image/jpeg,image/png"></input>
              <button className="input-group-text align-self-center mx-1" for="inputGroupFile02">적용</button>
              </div>
            </div>
            <p for="formGroupExampleInput" className="form-label text-start">
              성명
            </p>
            <input
              type="text"
              className="form-control mb-4"
              id="formGroupExampleInput"
              placeholder="변경할 성명"
            ></input>

            <p for="formGroupExampleInput" className="form-label text-start">
              사용자 이름
            </p>
            <input
              type="text"
              className="form-control mb-4"
              id="formGroupExampleInput"
              placeholder="변경 할 사용자 이름 "
              value={userName}
            ></input>

            <p for="formGroupExampleInput" className="form-label text-start">
              전화번호
            </p>
            <input
              type="text"
              className="form-control mb-4"
              id="formGroupExampleInput"
              placeholder="전화번호 "
            ></input>

            <button type="button" className="btn btn-primary">
              변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoChange;
