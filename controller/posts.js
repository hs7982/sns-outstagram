const { response, json } = require("express");
const db = require("../database/db");
const session = require("express-session");
const upload = require("../multUpload");

const posts = (req, res) => {
  const lastPostId = req.query.lastPostId; // 클라이언트가 마지막으로 받은 게시물의 ID
  const limit = 8; // 한 번에 가져올 게시물 개수

  if (req.session.isLogin) {
    let query =
      "SELECT post.post_id, post.post_user_id, post.post_content, post.post_image_url, post.post_hits, post.post_write_date, user.user_name, user.user_image, COUNT(comment.comment_id) AS comment_count \
    FROM post \
    LEFT OUTER JOIN user ON post.post_user_id = user.user_id_no \
    LEFT OUTER JOIN post_comment AS comment ON post.post_id = comment.comment_post_id ";
    if (lastPostId) query += "WHERE post.post_id < " + lastPostId;
    query +=
      " GROUP BY post.post_id \
    ORDER BY post.post_id DESC \
    LIMIT " + limit;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(204).json("조회된 게시물이 없습니다.");
      }
    });
  } else {
    res.status(401).json("로그인해주세요.");
  }
};

const followPosts = (req, res) => {
  const lastPostId = req.query.lastPostId; // 클라이언트가 마지막으로 받은 게시물의 ID
  const limit = 8; // 한 번에 가져올 게시물 개수

  if (req.session.isLogin) {
    const userId = req.session.userIdNo;

    let sql =
      "SELECT p.post_id, p.post_user_id, p.post_content, p.post_image_url, p.post_hits, p.post_write_date, u.user_name, u.user_image, COUNT(c.comment_id) AS comment_count\
    FROM post p\
    LEFT JOIN user u ON p.post_user_id = u.user_id_no\
    LEFT JOIN post_comment c ON p.post_id = c.comment_post_id\
    WHERE (p.post_user_id = ? OR p.post_user_id IN (SELECT f.followed_user_id FROM follows f WHERE f.user_id = ?)) ";
    if (lastPostId) sql += " AND p.post_id < " + lastPostId;
    sql +=
      " GROUP BY p.post_id\
    ORDER BY p.post_write_date DESC \
    LIMIT " + limit;

    const values = [userId, userId];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(204).json("조회된 게시물이 없습니다.");
      }
    });
  } else {
    res.status(401).json("로그인해주세요.");
  }
};

const postComment = (req, res) => {
  if (req.session.isLogin) {
    const userId = req.session.userIdNo;
    const postId = Number(req.body.postId);
    const content = req.body.content;

    const sql =
      "INSERT INTO `outstagram`.`post_comment` (`comment_post_id`, `comment_user_id`, `comment_conent`) VALUES (?, ?, ?);";
    const values = [postId, userId, content];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.affectedRows > 0) {
        // Return success response
        return res.status(201).json("댓글이 생성되었습니다.");
      } else {
        res.status(400).json("댓글 작성에 실패하였습니다.");
      }
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const getComment = (req, res) => {
  const postId = Number(req.params.id);

  if (req.session.isLogin) {
    const sql =
      "SELECT comment_id, comment_post_id, comment_user_id, comment_conent, comment_time, user_name, user_image FROM post_comment LEFT OUTER JOIN user ON post_comment.comment_user_id = user.user_id_no WHERE comment_post_id = ?";
    const values = [postId];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        // Return success response
        return res.status(200).json(results);
      } else {
        res.status(204).json("조회된 댓글이 없습니다.");
      }
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const delComment = (req, res) => {
  const commentId = req.params.id;

  if (req.session.isLogin) {
    const userId = req.session.userIdNo;

    const verifiSql =
      "SELECT `comment_user_id` FROM `outstagram`.`post_comment` WHERE `comment_id` = ?";
    const verifiValues = [commentId];

    db.query(verifiSql, verifiValues, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        if (results[0].comment_user_id === userId || req.session.isAdmin === 1) {
          const sql = "DELETE FROM `outstagram`.`post_comment` WHERE `comment_id` = ?";
          const values = [commentId];

          db.query(sql, values, (err, results) => {
            if (err) {
              console.error("Error executing SQL query:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (results.affectedRows > 0) {
              return res
                .status(200)
                .json({ ok: "댓글 삭제 완료 : ", commentID: commentId });
            } else {
              return res
                .status(500)
                .json({ error: "댓글 삭제를 처리할 수 없습니다." });
            }
          });
        } else {
          //권한없는경우
          return res.status(403).json({ error: "권한이 없습니다." });
        }
      } else {
        //select문 result가 0개인경우
        return res.status(400).json({ error: "해당하는 댓글이 없습니다." });
      }
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const getPost = (req, res) => {
  const postId = Number(req.params.id);

  if (req.session.isLogin) {
    const sql =
      "SELECT post_id, post_user_id, post_content, post_image_url, post_hits, post_write_date, user_name, user_image FROM post LEFT OUTER JOIN user ON post.post_user_id = user.user_id_no WHERE post_id = ? ORDER BY post_write_date desc";
    const values = [postId];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        // Return success response
        return res.status(200).json(results);
      } else {
        res.status(400).json("조회된 게시물이 없습니다.");
      }
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const getUserPost = (req, res) => {
  const userId = Number(req.params.id);

  if (req.session.isLogin) {
    const sql =
      "SELECT post_id, post_user_id, post_content, post_image_url, post_hits, post_write_date, user_name, user_image FROM post LEFT OUTER JOIN user ON post.post_user_id = user.user_id_no WHERE user_id_no = ? ORDER BY post_write_date desc";
    const values = [userId];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        // Return success response
        return res.status(200).json(results);
      } else {
        res.status(204).json("조회된 게시물이 없습니다.");
      }
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const delPost = (req, res) => {
  const postId = req.params.id;

  if (req.session.isLogin) {
    const userId = req.session.userIdNo;

    const verifiSql =
      "SELECT `post_user_id` FROM `outstagram`.`post` WHERE `post_id` = ?";
    const verifiValues = [postId];

    db.query(verifiSql, verifiValues, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        if (results[0].post_user_id === userId || req.session.isAdmin === 1) {
          const sql = "DELETE FROM `outstagram`.`post` WHERE `post_id` = ?";
          const values = [postId];

          db.query(sql, values, (err, results) => {
            if (err) {
              console.error("Error executing SQL query:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (results.affectedRows > 0) {
              // Return success response
              return res
                .status(200)
                .json({ ok: "게시물 삭제 완료 : ", postID: postId });
            } else {
              return res
                .status(400)
                .json({ error: "게시물 삭제를 처리할 수 없습니다." });
            }
          });
        } else {
          //권한없는경우
          return res.status(403).json({ error: "권한이 없습니다." });
        }
      } else {
        //select문 result가 0개인경우
        return res.status(400).json({ error: "해당하는 게시물이 없습니다." });
      }
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const likePost = (req, res) => {
  const postId = req.params.id;

  if (req.session.isLogin) {
    const likeUserId = req.session.userIdNo;

    const sql =
      "INSERT INTO `outstagram`.`post_likes` (`like_user_id`, `like_post_id`) VALUES (?, ?)";
    const values = [likeUserId, postId];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.affectedRows > 0) {
        // Return success response
        return res.status(201).json({ ok: "좋아요 완료", postID: postId });
      } else {
        return res.status(400).json({ error: "좋아요를 처리할 수 없습니다." });
      }
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const unLikePost = (req, res) => {
  const postId = req.params.id;

  if (req.session.isLogin) {
    const likeUserId = req.session.userIdNo;

    const sql =
      "DELETE FROM `outstagram`.`post_likes`WHERE like_user_id=? AND like_post_id =?";
    const values = [likeUserId, postId];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.affectedRows > 0) {
        return res.status(201).json("좋아요 취소 완료" + postId);
      } else {
        return res
          .status(400)
          .json({ error: "좋아요 취소를 처리할 수 없습니다." });
      }
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const getLikePost = (req, res) => {
  const postId = Number(req.params.id);

  if (req.session.isLogin) {
    const likeUserId = req.session.userIdNo;

    const sql =
      "SELECT * FROM `outstagram`.`post_likes` WHERE like_user_id=? AND like_post_id =?";
    const values = [likeUserId, postId];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        // Return success response
        return res.status(200).json(true);
      } else {
        return res.status(200).json(false);
      }
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const getLikeList = (req, res) => {
  const postId = Number(req.params.id);

  if (req.session.isLogin) {
    const sql =
      "SELECT like_user_id, user_name, user_real_name, user_image FROM `outstagram`.`post_likes` LEFT OUTER JOIN user ON post_likes.like_user_id = user.user_id_no WHERE like_post_id =?";
    const values = [postId];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        // Return success response
        return res.status(200).json(results);
      } else {
        return res
          .status(204)
          .json("게시물에 좋아요를 표시한 사용자가 없습니다.");
      }
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const countLikes = (req, res) => {
  const postId = Number(req.params.id);

  if (req.session.isLogin) {
    const sql = "SELECT * FROM `outstagram`.`post_likes` WHERE like_post_id =?";
    const values = [postId];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json(results.length);
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const getLikeInfo = (req, res) => {
  const postId = Number(req.params.id);

  if (req.session.isLogin) {
    const likeUserId = req.session.userIdNo;

    const getLikeQuery =
      "SELECT * FROM `outstagram`.`post_likes` WHERE like_user_id=? AND like_post_id =?";
    const getLikeListQuery =
      "SELECT like_user_id, user_name, user_real_name, user_image FROM `outstagram`.`post_likes` LEFT OUTER JOIN user ON post_likes.like_user_id = user.user_id_no WHERE like_post_id =?";
    const countLikesQuery =
      "SELECT * FROM `outstagram`.`post_likes` WHERE like_post_id =?";

    const values = [likeUserId, postId];

    db.query(getLikeQuery, values, (err, likeResults) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      db.query(getLikeListQuery, [postId], (err, likeListResults) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        db.query(countLikesQuery, [postId], (err, countResults) => {
          if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          const likeStatus = likeResults.length > 0;
          const likeCount = countResults.length;

          return res
            .status(200)
            .json({ likeStatus, likeList: likeListResults, likeCount });
        });
      });
    });
  } else {
    res.status(401).json({ error: "로그인이 필요합니다." });
  }
};

const searchPost = (req, res) => {
  const keyword = "%" + req.params.keyword + "%";
  db.query(
    "SELECT * FROM `outstagram`.`post` WHERE post_content LIKE ?",
    [keyword],
    (err, results) => {
      if (err) {
        res.status(500).json("서버에러입니다.");
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(204).json("조회된 게시물이 없습니다.");
      }
    }
  );
};

// 검색에서 댓글 검색해서 조회하기
const searchComment = (req, res) => {
  const keyword = "%" + req.params.keyword + "%";
  db.query(
    "SELECT comment_id, comment_post_id, comment_user_id, comment_conent, comment_time, user_name, user_image FROM post_comment LEFT OUTER JOIN user ON post_comment.comment_user_id = user.user_id_no WHERE comment_conent LIKE ?",
    [keyword],
    (err, results) => {
      if (err) {
        res.status(500).json("서버에러입니다.");
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(204).json("조회된 댓글이 없습니다.");
      }
    }
  );
};

const writeNewPost = [
  upload.array("PostImages"),
  (req, res) => {
    if (req.session.isLogin) {
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

const postReport = (req, res) => {};

module.exports = {
  posts,
  followPosts,
  writeNewPost,
  getPost,
  delPost,
  searchPost,
  likePost,
  unLikePost,
  getLikePost,
  countLikes,
  postComment,
  getComment,
  delComment,
  postReport,
  getLikeList,
  getUserPost,
  searchComment,
  getLikeInfo,
};
