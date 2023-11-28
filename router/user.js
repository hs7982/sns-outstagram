const express = require("express");
const router = express.Router();
const db = require("../database/db");

const { login, logout, singup, getmyinfo, pwChange, leaveId, getUserInfo, changeProfileImg, followUser, unfollowUser,getFollowerNum,followingNum  } = require("../controller/user");




router.post("/login", login);

router.post("/logout", logout);

router.post("/singup", singup);

router.post("/pwChange", pwChange);

router.post("/leaveId", leaveId);

router.get("/myInfo", getmyinfo);

router.post("/changeProfileImg", changeProfileImg);

router.get("/:id", getUserInfo)

router.post('/follow', followUser);
router.post('/unfollow', unfollowUser);

router.get('/followerNum/:id', getFollowerNum);
router.get('/followingNum/:id', followingNum);



module.exports = router;
