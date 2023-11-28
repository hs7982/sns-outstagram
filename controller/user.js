//const userDatabase = require("../Database");
const { response } = require("express");
const db = require("../database/db");
const session = require("express-session");


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
            userProfileImg: results[0].user_image,
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

const getUserInfo = (req, res) => {
  const userId = req.params.id;
  res.send(userId);
}

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

module.exports = {
  login,
  logout,
  singup,
  getmyinfo,
  pwChange,
  leaveId,
  getUserInfo
};
