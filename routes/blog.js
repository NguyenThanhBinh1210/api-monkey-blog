var express = require("express");
var router = express.Router();

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
const middlewareController = require("../middleware/auth.js");

// Tạo blog
router.post("/post", createBlog);

// Lấy blog của mình
router.get(
  "/userblog/:id",
  middlewareController.verifyTokenAndAdmin,
  getBlogByUserId
);

// lấy tất cả blog
router.get("/", getBlogs);

// sửa blog của mình
router.put("/put/:id", middlewareController.verifyTokenEditBlog, editBlog);

// Lấy blog theo tag
router.get("/tag/:tag", getBlogByTag);

// Xoá blog của mình
router.delete("/delete/:id", middlewareController.verifyToken, deleteBlog);

// Tìm kiếm blog
router.get("/search", Search);

// Lấy 1 blog
router.get("/:id", getBlog);

module.exports = router;
