const multer = require("multer");
const uuid4 = require("uuid4");
const path = require("path");

// 파일을 저장할 디렉토리 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === "PostImages") {
      uploadPath = path.join(__dirname, "upload"); // 프로필 이미지 저장 경로
    } else if (file.fieldname === "profileImage") {
      uploadPath = path.join(__dirname, "upload/profile"); // 프로필이미지 저장 경로
    } else {
      uploadPath = path.join(__dirname, "upload"); // 기본 이미지 저장 경로
    }
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const randomID = uuid4();
    const ext = path.extname(file.originalname);
    const filename = randomID + ext;
    cb(null, filename); // 파일 이름 설정
  },
});

// 이미지 파일 확인
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("허용되지 않는 파일 형식입니다");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 파일 사이즈 10MB로 제한
  },
});

module.exports = upload;
