var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth.js");

const {
  getBlogs,
  getBlog,
  createBlog,
  editBlog,
  deleteBlog,
  getBlogByTag,
  // getBlogBySearch,
  getBlogByUserId,
  Search,
} = require("../controllers/blog.js");
const verifyToken = require("../middleware/auth.js");

router.post("/post", verifyToken, createBlog);
router.get("/userblog/:id", verifyToken, getBlogByUserId);
router.get("/", getBlogs);
router.put("/put/:id", verifyToken, editBlog);
router.get("/tag/:tag", getBlogByTag);
router.delete("/delete/:id", verifyToken, deleteBlog);
router.get("/search", Search);
router.get("/:id", getBlog);

module.exports = router;
