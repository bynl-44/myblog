const express = require("express");
const User = require("../controller/user");
const router = express.Router();

router.get("/signin", function(req, res) {
  res.render("signin", {});
});
router.post("/signin", User.signin);
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", User.signup);
router.get("/signout", User.signout);
module.exports = router;
