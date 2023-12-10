import React, { useContext, useState } from "react";
import { UserContext } from "../../components/UserContext";
import SettingNav from "./SettingNav";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const InfoChange = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [userRealName, setUserRealName] = useState(user.user.userRealName);
  const [userName, setUserName] = useState(user.user.userName);
  const [userTel, setUserTel] = useState(user.user.userTel);
  const [userEmail, setUserEmail] = useState(user.user.userEmail);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setprofileImage] = useState(user.user.userProfileImg);

  const fileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setSelectedFile(file);
    toast("프로필 이미지가 선택되었습니다.적용버튼을 눌러주세요.", { type: "info" });
  };

  const upload = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      // 서버에 POST 요청 보내기
      const response = await axios.post(
        "/api/user/changeProfileImg",
        formData,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast("프로필 사진이 변경되었습니다.", { type: "success" });
        window.location.reload();
      } else {
        // 업로드 실패한 경우 처리
        toast("프로필 사진 변경에 실패했습니다.", { type: "error" });
      }
    } catch (error) {
      console.error("오류 발생:", error);
      toast("오류가 발생하였습니다.", { type: "error" });
    }
  };
  return (
    //성명, 사용자 이름, 전화번호 변경
    <div className="d-flex flex-wrap" style={{ width: "100%" }}>
      <SettingNav />
      <div className="overflow-y-auto my-3 mx-auto">
        <div className="fs-3">정보 변경</div>

        <div>
          <div className="m-5">
            <div className="mb-4">
              <p className="text-start">프로필 사진</p>
              <div className="d-flex">
                <img
                  src={"/api/upload/profile/" + profileImage}
                  alt=""
                  width="100"
                  height="100"
                  className="rounded-circle me-2 bg-secondary-subtle object-fit-cover border"
                ></img>
                <input
                  type="file"
                  className="form-control align-self-center ms-2"
                  accept="image/jpeg,image/png"
                  onChange={(e) => fileChange(e)}
                ></input>
                <button
                  className="input-group-text align-self-center mx-1"
                  for="inputGroupFile02"
                  onClick={() => upload()}
                >
                  적용
                </button>
              </div>
            </div>

            <p for="formGroupExampleInput" className="form-label text-start">
              이메일
            </p>
            <input
              type="email"
              className="form-control"
              id="formGroupExampleInput"
              value={userEmail}
              disabled
              readonly
            ></input>
            <div className="form-text mb-3 text-start">
              이메일은 변경할 수 없습니다.
            </div>

            <p for="formGroupExampleInput" className="form-label text-start">
              성명
            </p>
            <input
              type="text"
              className="form-control mb-4"
              id="formGroupExampleInput"
              placeholder="변경할 성명"
              value={userRealName}
              onChange={(e) => setUserRealName(e.target.value)}
            ></input>

            <p for="formGroupExampleInput" className="form-label text-start">
              사용자 이름
            </p>
            <input
              type="text"
              className="form-control mb-4"
              id="formGroupExampleInput"
              placeholder="변경 할 사용자 이름 "
              onChange={(e) => {
                setUserName(e.target.value);
              }}
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
              value={userTel}
              onChange={(e) => setUserTel(e.target.value)}
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
