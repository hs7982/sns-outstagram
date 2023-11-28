const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Back-End Api Server");
});

module.exports = router;
