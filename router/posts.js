const express = require("express");
const router = express.Router();
const db = require("../database/db");

const { posts, writeNewPost, getPost, delPost, searchPost, likePost, unLikePost, getLikePost, countLikes, postComment, getComment } = require("../controller/posts");

//일반라우팅

router.get("/feed", posts);

router.post("/new", writeNewPost);

router.post("/comment", postComment)


//파라미터를 이용한 라우팅
router.get("/comment/:id", getComment)

router.get("/search/:keyword", searchPost);

router.get("/like/count/:id", countLikes);

router.get("/like/:id", getLikePost);

router.post("/like/:id", likePost);

router.delete("/like/:id", unLikePost);

router.get("/post/:id", getPost);

router.delete("/post/:id", delPost);

module.exports = router;
