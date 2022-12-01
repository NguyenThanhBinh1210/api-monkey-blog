var express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  getUser,
  editUser,
  reqRefreshToken,
} = require("../controllers/user.js");
const middlewareController = require("../middleware/auth.js");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/:id", middlewareController.verifyToken, getUser);
router.put("/edit/:id", middlewareController.verifyToken, editUser);
router.post("/refresh", reqRefreshToken);

module.exports = router;
