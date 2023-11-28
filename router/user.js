const express = require("express");
const router = express.Router();
const db = require("../database/db");

const { login, logout, singup, getmyinfo, pwChange, leaveId, getUserInfo } = require("../controller/user");

router.post("/login", login);

router.post("/logout", logout);

router.post("/singup", singup);

router.post("/pwChange", pwChange);

router.post("/leaveId", leaveId);

router.get("/myInfo", getmyinfo);

router.get("/:id", getUserInfo)




module.exports = router;
