const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModal = require("../models/user.js");

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModal.findOne({ email: email });
    if (!user)
      return res
        .status(404)
        .json({ message: "Email hoặc mật khẩu không đúng!" }); // email khong dung

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng!" }); // mat khau khong dung

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const oldUser = await UserModal.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "Tài khoản đã tồn tai!" }); // User da dc dang ki
    }
    // const hashedPassword = await bcrypt.hash(password, 12); // Ma hoa mat khau
    const result = await UserModal.create({
      email,
      password: passwordHash,
      name: fullName,
    }); // Bat dau tao user

    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Có lỗi ở đâu đó!" }); // Co loi o dau do
  }
};
const getUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await UserModal.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: "Lỗi không lấy được !" });
  }
};

const editUser = async (req, res) => {
  try {
    const body = req.body;
    // const salt = await bcrypt.genSalt();
    // const passwordHash = await bcrypt.hash(body.password, salt);
    const Info = {
      ...body,
    };
    await UserModal.updateOne({ _id: req.params.id }, Info);
    res.status(200).json(Info);
  } catch (error) {
    res.status(404).json({ message: "Lỗi ở đâu đó!" });
  }
};

module.exports = { signup, signin, getUser, editUser };
