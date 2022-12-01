const BlogModal = require("../models/blog");
const UserModal = require("../models/user");
const getBlogs = async (req, res, next) => {
  BlogModal.find({})
    .then((item) => {
      res.status(200).json(item);
    })
    .catch((err) => console.log(err));
};

const createBlog = async (req, res) => {
  try {
    const blog = req.body;
    const user = await UserModal.findById(blog.userId);
    const newBlog = new BlogModal({
      userId: user.userId,
      author: user.name,
      ...blog,
      createdAt: new Date().toISOString(),
    });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(404).json({ message: "Lỗi không tạo được" });
  }
};

const editBlog = function (req, res, next) {
  BlogModal.updateOne({ _id: req.params.id }, req.body)
    .then((item) => res.status(200).json({ message: "Chỉnh sửa thành công!" }))
    .catch(next);
};

const deleteBlog = async (req, res, next) => {
  const { id } = req.params;
  try {
    await BlogModal.findByIdAndDelete(id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

const getBlogByTag = function (req, res, next) {
  BlogModal.find({ tags: req.params.tag })
    .then((item) => res.status(200).json(item))
    .catch(next);
};

const Search = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const blogs = await BlogModal.find({ title });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
const getBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await BlogModal.findById(id);
    res.status(200).json(blog);
  } catch (error) {
    res.status(404).json({ message: "Lỗi không lấy được!" });
  }
};
const getBlogByUserId = async (req, res) => {
  console.log(req.user.id, req.params.id);
  try {
    const blog = await BlogModal.find({ userId: req.params.id });
    res.status(200).json(blog);
  } catch (error) {
    res.status(404).json({ message: "Lỗi không lấy được!" });
  }
};

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  editBlog,
  deleteBlog,
  getBlogByTag,
  // getBlogBySearch,
  getBlogByUserId,
  Search,
};
