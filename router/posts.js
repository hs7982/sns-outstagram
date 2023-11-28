const express = require("express");
const router = express.Router();
const db = require("../database/db");

const { posts, writeNewPost, getPost, delPost, searchPost } = require("../controller/posts");

router.get("/feed", posts);

router.post("/new", writeNewPost);

router.get("/search/:keyword", searchPost);

router.get("/post/:id", getPost);

router.delete("/post/:id", delPost);





module.exports = router;
