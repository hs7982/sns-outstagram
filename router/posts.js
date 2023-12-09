const express = require("express");
const router = express.Router();
const db = require("../database/db");

const { posts, writeNewPost, getPost, delPost, searchPost, likePost, unLikePost, getLikePost, countLikes, postComment, getComment, getLikeList, getUserPost, searchComment,  followPosts } = require("../controller/posts");

//일반라우팅

router.get("/feed", posts);

router.get("/followFeed", followPosts)

router.post("/new", writeNewPost);

router.post("/comment", postComment)


//파라미터를 이용한 라우팅
router.get("/comment/:id", getComment)

router.get("/search/:keyword", searchPost);

router.get("/like/count/:id", countLikes);

router.get("/like/list/:id", getLikeList);

router.get("/like/:id", getLikePost);

router.post("/like/:id", likePost);

router.delete("/like/:id", unLikePost);

router.get("/post/user/:id", getUserPost);

router.get("/post/:id", getPost);

router.get('/searchComment/:keyword', searchComment);


router.delete("/post/:", delPost);


module.exports = router;
