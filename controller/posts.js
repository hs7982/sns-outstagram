const { response, json } = require("express");
const db = require("../database/db");
const session = require("express-session");
const upload = require("../multUpload");

const posts = (req, res) => {
  if (req.session.isLogin) {
    db.query(
      "SELECT post_id, post_user_id, post_content, post_image_url, post_hits, post_write_date, user_name, user_image FROM post LEFT OUTER JOIN user ON post.post_user_id = user.user_id_no ORDER BY post_write_date desc",
      (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          res.status(200).json(results);
        } else {
          res.status(204).json("조회된 게시물이 없습니다.");
        }
      }
    );
  } else {
    res.status(401).json("로그인해주세요.");
  }
};

const getPost = (req, res) => {
  const postId = req.params.id;
  res.send(postId);
}

const delPost = (req, res) => {
  const postId = req.params.id;
  res.send(postId);
}

const searchPost = (req, res) => {
  const keyword = "%" + req.params.keyword +"%";
  db.query("SELECT * FROM `outstagram`.`post` WHERE post_content LIKE ?", [keyword], (err, results) => {
    if (err) {
      res.status(500).json("서버에러입니다.");
      console.log(err);
    };
    if (results.length > 0) {
      res.status(200).json(results);

    } else {
      res.status(204).json("조회된 게시물이 없습니다.");
    }
  });

}

const writeNewPost = [
  upload.array("PostImages"),
  (req, res) => {
    if (req.session.isLogin) {
      console.log(req.body.content);
      const userId = req.session.userIdNo;
      const imageUrls = {};
      const content = req.body.content;

      for (let i = 0; i < req.files.length; i++) {
        imageUrls[i] = req.files[i].filename;
      }

      db.query(
        "INSERT INTO `outstagram`.`post` (`post_user_id`, `post_content`,`post_image_url`) VALUES (?, ?, ?);",
        [userId, content, JSON.stringify(imageUrls)],
        (err, results) => {
          if (err) {
            res.status(500).json("서버에러입니다.");
            console.log(err);
          } else res.status(201).json("게시물이 성공적으로 업로드되었습니다.");
        }
      );
    }
  },
];

module.exports = {
  posts,
  writeNewPost,
  getPost,
  delPost,
  searchPost
};
