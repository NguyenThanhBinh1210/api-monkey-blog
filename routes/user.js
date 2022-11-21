var express = require("express");
const router = express.Router();

const { signup, signin, getUser, editUser } = require("../controllers/user.js");
const verifyToken = require("../middleware/auth.js");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/:id", verifyToken, getUser);
router.put("/edit/:id", verifyToken, editUser);

module.exports = router;
