//const userDatabase = require("../Database");
const { response, json } = require("express");
const db = require("../database/db");
const session = require("express-session");
const upload = require("../multUpload");

const login = (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM `user` WHERE `user_email` = ? AND `user_password` = ?",
    [email, password],
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        req.session.isLogin = true;
        req.session.userIdNo = results[0].user_id_no;
        req.session.userEmail = results[0].user_email;
        (req.session.userName = results[0].user_name),
          (req.session.isAdmin = results[0].user_is_admin),
          req.session.save();
        res.status(200).json({
          isLogin: true,
          userIdNo: results[0].user_id_no,
          userEmail: results[0].user_email,
          userName: results[0].user_name,
          userProfileImg: results[0].user_image,
        });
      } else {
        res
          .status(403)
          .json("Not Authorized: 해당 정보와 일치하는 계정이 없습니다.");
      }
    }
  );
};

const getmyinfo = (req, res) => {
  if (req.session.isLogin) {
    db.query(
      "SELECT * FROM `user` WHERE `user_id_no` = ?",
      [req.session.userIdNo],
      (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          res.status(200).json({
            isLogin: true,
            userIdNo: results[0].user_id_no,
            userEmail: results[0].user_email,
            userName: results[0].user_name,
            userRealName: results[0].user_real_name,
            userProfileImg: results[0].user_image,
            userTel: results[0].user_tel,
          });
        } else {
          res.status(200).json({ isLogin: false });
        }
      }
    );
  } else {
    res.status(200).json({ isLogin: false });
  }
};

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
  db.query(
    //이미 존재하는 계정인지 검증(이메일, 사용자이름 중복X)
    "SELECT * FROM `user` WHERE `user_email` = ? OR `user_name` = ?",
    [email, userName],
    (err, results) => {
      if (err) throw err;
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
            if (err) throw err;
            res.status(201).json("계정이 생성되었습니다.");
          }
        );
      }
    }
  );
};

const getUserInfo = (req, res) => {
  if (req.session.isLogin) {
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
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const pwChange = (req, res) => {
  const userId = req.session.userIdNo;
  const { oriPassword, newPassword, reNewPassword } = req.body;
  if (newPassword === reNewPassword) {
    if (newPassword !== oriPassword) {
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
    } else {
      res.status(400).json("현재 비밀번호와 변경할 비밀번호가 동일합니다.");
    }
  } else {
    res
      .status(400)
      .json("비밀번호 재입력란이 새로운 비밀번호와 일치하지 않습니다.");
  }
};

const leaveId = (req, res) => {
  if (req.session.isLogin) {
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
  } else {
    res.status(401).json("로그인해주세요.");
  }
};

const changeProfileImg = [
  upload.array("profileImage"),
  (req, res) => {
    if (req.session.isLogin) {
      const userId = req.session.userIdNo;
      const imageUrls = req.files[0].filename;

      db.query(
        "UPDATE `outstagram`.`user` SET `user_image`=? WHERE  `user_id_no`=?",
        [imageUrls, userId],
        (err, results) => {
          if (err) {
            res.status(500).json("서버에러입니다.");
            console.log(err);
          } else
            res
              .status(200)
              .json("프로필 사진이 성공적으로 업데이트 되었습니다.");
        }
      );
    }
  },
];

// 팔로우 추가
const followUser = (req, res) => {
  if (req.session.isLogin) {
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
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

// 팔로우 취소
const unfollowUser = (req, res) => {
  if (req.session.isLogin) {
    const userId = req.session.userIdNo;
    const followedId = Number(req.body.userId);

    const sql =
      "DELETE FROM follows WHERE user_id = ? AND followed_user_id = ?";
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
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

// 팔로우 갯수 조회
const getFollowerNum = (req, res) => {
  if (req.session.isLogin) {
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
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

// 팔로잉 수 계산
const followingNum = (req, res) => {
  if (req.session.isLogin) {
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
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

//팔로워 목록 조회
const getFollowerList = (req, res) => {
  if (req.session.isLogin) {
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
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

// 팔로잉 목록 조회
const followingList = (req, res) => {
  if (req.session.isLogin) {
    const userId = Number(req.params.id);

    const sql = "SELECT user_id, followed_user_id, user_name, user_real_name, user_image FROM follows LEFT OUTER JOIN user ON follows.followed_user_id = user.user_id_no WHERE follows.user_id = ? ORDER BY follow_date DESC";
    const values = [userId];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) return res.status(200).json(results);
      else return res.status(204).json("팔로잉이 없습니다.");
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const isFollowing = (req, res) => {
  if (req.session.isLogin) {
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
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

//검색에서 사용자 검색해서 조회하기
const searchUser = (req, res) => {
  const keyword = "%" + req.params.keyword + "%";
  db.query(
    "SELECT * FROM `outstagram`.`user` WHERE user_name LIKE ? OR user_real_name LIKE ?",
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
  
  changeProfileImg,
};
