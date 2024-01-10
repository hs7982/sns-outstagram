//const userDatabase = require("../Database");
const { response, json } = require("express");
const db = require("../database/db");
const session = require("express-session");
const upload = require("../multUpload");

//사용자 정보 입력값 검증 정규표현식
const usernameRegex = /^[a-zA-Z0-9_.-]+$/; // 영어 알파벳, 숫자, -, _ 포함
const nameRegex = /^[a-zA-Z가-힣\s]+$/; // 영어 알파벳, 한글, 공백만 포함
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 유효성 검사
const telRegex = /^[0-9-]+$/; // 전화번호 유효성 검사
const passwordRegex =
  /^(?=.*[~!@#$%^&*])(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*]{6,}$/; // 비밀번호 유효성 검사를 위한 정규 표현식

const login = (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM `user` WHERE `user_email` = ? AND `user_password` = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json("Internal Server Error");
      }
      if (results.length > 0) {
        req.session.isLogin = true;
        req.session.userIdNo = results[0].user_id_no;
        req.session.userEmail = results[0].user_email;
        (req.session.userName = results[0].user_name),
          (req.session.isAdmin = results[0].user_is_admin),
          req.session.save();
        res.status(200).json(sendUserInfo(results));
      } else {
        res.status(403).json("해당 정보와 일치하는 계정이 없습니다.");
      }
    }
  );
};

const getmyinfo = (req, res) => {
  if (!req.session.isLogin) return res.status(200).json({ isLogin: false });

  // 사용자 정보 가져오기
  db.query(
    "SELECT * FROM `user` WHERE `user_id_no` = ?",
    [req.session.userIdNo],
    (err, results) => {
      if (err) {
        console.error("SQL 쿼리 실행 중 오류 발생:", err);
        return res.status(500).json({ error: "내부 서버 오류" });
      }

      if (results.length > 0) {
        // 마지막 로그인 시간 업데이트
        const now = new Date();
        db.query(
          "UPDATE `outstagram`.`user` SET `user_last_login`=? WHERE `user_id_no`=?",
          [now, req.session.userIdNo],
          (err, result) => {
            if (err) {
              console.error("마지막 로그인 시간 업데이트 오류:", err);
            }
          }
        );

        // 사용자 정보를 응답으로 보내기
        res.status(200).json(sendUserInfo(results));
      } else {
        res.status(200).json({ isLogin: false });
      }
    }
  );
};

const sendUserInfo = (results) => {
  let userInfo = {
    isLogin: true,
    userIdNo: results[0].user_id_no,
    userEmail: results[0].user_email,
    userName: results[0].user_name,
    userRealName: results[0].user_real_name,
    userProfileImg: results[0].user_image,
    userTel: results[0].user_tel,
  };
  const isAdmin = results[0].user_is_admin;
  if (isAdmin) userInfo.isAdmin = true;

  return userInfo;
}

const logout = (req, res) => {
  if (!req.session.userIdNo) {
    res.status(400).json("not authorized");
  } else {
    req.session.destroy();
    res.status(200).json("OK");
  }
};

const singup = (req, res) => {
  const { name, userName, tel, email, password } = req.body;

  if (!nameRegex.test(name) || name.length < 2) {
    return res
      .status(400)
      .json("실명은 2자 이상이어야 하며 한글과 영어만 허용됩니다.");
  }

  if (!usernameRegex.test(userName) || userName.length < 3) {
    return res
      .status(400)
      .json(
        "사용자 이름이 3자 미만이거나 허용되지 않는 문자가 포함되어 있습니다. (허용문자: 영어 알파벳, 숫자, -, _, .)"
      );
  }

  if (!telRegex.test(tel)) {
    return res
      .status(400)
      .json("전화번호는 숫자와 대시(-)만 입력할 수 있습니다.");
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json("올바른 이메일 형식이 아닙니다.");
  }

  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json(
        "비밀번호는 최소 6자 이상이어야 하며, 영어, 숫자, 특수문자를 반드시 포함해야 합니다."
      );
  }

  db.query(
    //이미 존재하는 계정인지 검증(이메일, 사용자이름 중복X)
    "SELECT * FROM `user` WHERE `user_email` = ? OR `user_name` = ?",
    [email, userName],
    (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length > 0) {
        if (results[0].user_email == email) {
          //이메일 중복
          res
            .status(400)
            .json("이메일 '" + email + "'과 일치하는 계정이 이미 존재합니다.");
        } else if (results[0].user_name == userName) {
          //사용자이름 중복
          res
            .status(400)
            .json("사용자 이름 '" + userName + "'는 이미 사용중입니다.");
        } else {
          res.status(500).json("예외되지 않은 에러입니다");
        }
      } else {
        //중복된 값이 없다면, 계정 생성
        db.query(
          "INSERT INTO `outstagram`.`user` (`user_name`, `user_real_name`, `user_email`,`user_tel`, `user_password`) VALUES (?, ?, ?, ?, ?);",
          [userName, name, email, tel, password],
          (err, results) => {
            if (err) {
              console.error("Error executing SQL query:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            res.status(201).json("계정이 생성되었습니다.");
          }
        );
      }
    }
  );
};

const getUserInfo = (req, res) => {
  if (!req.session.isLogin)
    return res.status(401).json({ error: "로그인이 필요합니다." });
  const userId = Number(req.params.id);

  const sql =
    "SELECT user_id_no, user_name, user_real_name, user_image FROM user WHERE user_id_no = ?";
  const values = [userId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      return res.status(200).json(results);
    }

    return res.status(204).json("no user");
  });
};

const pwChange = (req, res) => {
  if (!req.session.isLogin)
    return res.status(401).json({ error: "로그인이 필요합니다." });

  const userId = req.session.userIdNo;
  const { oriPassword, newPassword, reNewPassword } = req.body;

  //사용자 입력값 검증단계
  if (newPassword !== reNewPassword) {
    return res
      .status(400)
      .json("비밀번호 재입력란이 새로운 비밀번호와 일치하지 않습니다.");
  }
  if (!passwordRegex.test(newPassword)) {
    return res
      .status(400)
      .json(
        "비밀번호는 최소 6자 이상이어야 하며, 영어, 숫자, 특수문자를 반드시 포함해야 합니다."
      );
  }
  if (newPassword === oriPassword) {
    return res
      .status(400)
      .json("현재 비밀번호와 변경할 비밀번호가 동일합니다.");
  }

  //변경수행
  db.query(
    "select user_id_no, user_password from user where user_id_no = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json("server error");
      } else if (oriPassword === results[0].user_password) {
        db.query(
          "update user set user_password=? where user_id_no=?",
          [newPassword, userId],
          (err, results) => {
            if (err) {
              console.log(err);
              res.status(500).json("server error");
            } else {
              res.status(200).json("비밀번호 변경에 성공하였습니다.");
            }
          }
        );
      } else {
        res.status(400).json("현재 비밀번호가 일치하지 않습니다.");
      }
    }
  );
};

const userInfoChange = (req, res) => {
  if (!req.session.isLogin) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }

  const userId = req.session.userIdNo;
  const { user_name, user_real_name, user_tel } = req.body;

  // 사용자 입력값 검증
  if (!nameRegex.test(user_real_name) || user_real_name.length < 2) {
    return res
      .status(400)
      .json("실명은 2자 이상이어야 하며 한글과 영어만 허용됩니다.");
  }

  if (!usernameRegex.test(user_name) || user_name.length < 3) {
    return res
      .status(400)
      .json(
        "사용자 이름이 3자 미만이거나 허용되지 않는 문자가 포함되어 있습니다. (허용문자: 영어 알파벳, 숫자, -, _, .)"
      );
  }

  if (!telRegex.test(user_tel)) {
    return res
      .status(400)
      .json("전화번호는 숫자와 대시(-)만 입력할 수 있습니다.");
  }

  // 데이터베이스 업데이트
  const updateQuery =
    "UPDATE `outstagram`.`user` SET `user_name`=?, `user_real_name`=?, `user_tel`=? WHERE `user_id_no`=?";

  db.query(
    updateQuery,
    [user_name, user_real_name, user_tel, userId],
    (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.affectedRows > 0) {
        res.status(200).json("사용자 정보가 성공적으로 업데이트되었습니다.");
      } else {
        res.status(400).json("사용자 정보 업데이트에 실패하였습니다.");
      }
    }
  );
};

const leaveId = (req, res) => {
  if (!req.session.isLogin)
    return res.status(401).json({ error: "로그인이 필요합니다." });
  const userId = req.session.userIdNo;
  db.query(
    "DELETE FROM `user` WHERE `user_id_no`=?",
    [userId],
    (err, deleteResults) => {
      if (err) {
        res.status(500).json("서버 오류");
        throw err;
      } else {
        db.query(
          "SELECT * FROM `user` WHERE `user_id_no`=?",
          [userId],
          (err, selectResults) => {
            if (err) {
              res.status(500).json("서버 오류");
              throw err;
            }
            if (selectResults.length === 0) {
              res.status(200).json("회원탈퇴가 완료되었습니다.");
            } else {
              res.status(500).json("서버 오류");
            }
          }
        );
      }
    }
  );
};

const changeProfileImg = [
  upload.array("profileImage"),
  (req, res) => {
    if (!req.session.isLogin)
      return res.status(401).json({ error: "로그인이 필요합니다." });
    const userId = req.session.userIdNo;
    const imageUrls = req.files[0].filename;

    db.query(
      "UPDATE `outstagram`.`user` SET `user_image`=? WHERE  `user_id_no`=?",
      [imageUrls, userId],
      (err, results) => {
        if (err) {
          res.status(500).json("서버에러입니다.");
          console.log(err);
        } else res.status(200).json(imageUrls);
      }
    );
  },
];

// 팔로우 추가
const followUser = (req, res) => {
  if (!req.session.isLogin)
    return res.status(401).json({ error: "로그인이 필요합니다." });
  const userId = req.session.userIdNo;
  const followedId = Number(req.body.userId);

  if (userId === followedId)
    return res.status(400).json("자신을 팔로우할 수 없습니다.");

  const checkSql =
    "select * FROM follows WHERE user_id=? AND followed_user_id=?";
  const checkValues = [userId, followedId];

  const sql = "INSERT INTO follows (user_id, followed_user_id) VALUES (?, ?)";
  const values = [userId, followedId];
  db.query(checkSql, checkValues, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length === 0) {
      db.query(sql, values, (err, results) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.affectedRows > 0) {
          // Return success response
          return res.status(201).json("팔로우성공");
        } else {
          res.status(400).json("팔로우 실패");
        }
      });
    } else return res.status(400).json("이미 팔로우중입니다.");
  });
};

// 팔로우 취소
const unfollowUser = (req, res) => {
  if (!req.session.isLogin)
    return res.status(401).json({ error: "로그인이 필요합니다." });
  const userId = req.session.userIdNo;
  const followedId = Number(req.body.userId);

  const sql = "DELETE FROM follows WHERE user_id = ? AND followed_user_id = ?";
  const values = [userId, followedId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows > 0) {
      // Return success response
      return res.status(200).json("팔로우 취소 성공");
    } else {
      res.status(400).json("팔로우 취소에 실패하였습니다.");
    }
  });
};

// 팔로우 갯수 조회
const getFollowerNum = (req, res) => {
  if (!req.session.isLogin)
    return res.status(401).json({ error: "로그인이 필요합니다." });
  const userId = Number(req.params.id);

  const sql =
    "SELECT COUNT(*) AS followCount FROM follows WHERE followed_user_id = ?";
  const values = [userId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const followCount = results[0].followCount;

    // 팔로우 갯수를 클라이언트에게 반환
    return res.status(200).json(followCount);
  });
};

// 팔로잉 수 계산
const followingNum = (req, res) => {
  if (!req.session.isLogin)
    return res.status(401).json({ error: "로그인이 필요합니다." });
  const userId = Number(req.params.id);

  const sql = "SELECT COUNT(*) AS followCount FROM follows WHERE user_id = ?";
  const values = [userId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const followCount = results[0].followCount;

    // 팔로잉 갯수를 클라이언트에게 반환
    return res.status(200).json(followCount);
  });
};

//팔로워 목록 조회
const getFollowerList = (req, res) => {
  if (!req.session.isLogin)
    return res.status(401).json({ error: "로그인이 필요합니다." });
  const userId = Number(req.params.id);

  const sql =
    "SELECT user_id, followed_user_id, user_name, user_real_name, user_image FROM follows LEFT OUTER JOIN user ON follows.user_id = user.user_id_no WHERE follows.followed_user_id = ? ORDER BY follow_date DESC";
  const values = [userId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) return res.status(200).json(results);
    else return res.status(204).json("팔로워가 없습니다.");
  });
};

// 팔로잉 목록 조회
const followingList = (req, res) => {
  if (!req.session.isLogin)
    return res.status(401).json({ error: "로그인이 필요합니다." });
  const userId = Number(req.params.id);

  const sql =
    "SELECT user_id, followed_user_id, user_name, user_real_name, user_image FROM follows LEFT OUTER JOIN user ON follows.followed_user_id = user.user_id_no WHERE follows.user_id = ? ORDER BY follow_date DESC";
  const values = [userId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) return res.status(200).json(results);
    else return res.status(204).json("팔로잉이 없습니다.");
  });
};

const isFollowing = (req, res) => {
  if (!req.session.isLogin)
    return res.status(401).json({ error: "로그인이 필요합니다." });
  const userId = req.session.userIdNo;
  const followUserId = Number(req.params.id);

  if (userId === followUserId) {
    return res.status(200).json(null);
  }

  const sql =
    "SELECT * FROM follows WHERE user_id = ? AND followed_user_id = ?";
  const values = [userId, followUserId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) return res.status(200).json(true);
    else return res.status(200).json(false);
  });
};

//검색에서 사용자 검색해서 조회하기
const searchUser = (req, res) => {
  if (!req.session.isLogin)
    return res.status(401).json({ error: "로그인이 필요합니다." });
  const keyword = "%" + req.params.keyword + "%";
  db.query(
    "SELECT user_id_no, user_name, user_real_name, user_image FROM `outstagram`.`user` WHERE user_name LIKE ? OR user_real_name LIKE ?",
    [keyword, keyword],
    (err, results) => {
      if (err) {
        res.status(500).json("서버에러입니다.");
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(204).json("조회된 사용자가 없습니다.");
      }
    }
  );
};

module.exports = {
  login,
  logout,
  singup,
  getmyinfo,
  pwChange,
  leaveId,
  getUserInfo,
  followUser,
  unfollowUser,
  getFollowerNum,
  followingNum,
  isFollowing,
  getFollowerList,
  followingList,
  searchUser,
  userInfoChange,

  changeProfileImg,
};
