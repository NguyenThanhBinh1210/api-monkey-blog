const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModal = require("../models/user.js");
let refreshTokens = [];
//  GENERATE ACCESS TOKEN
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
//  GENERATE REFRESH TOKEN
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, admin: user.admin },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "365d",
    }
  );
};

// LOGIN
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

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REQUEST REFRESH TOKEN
const reqRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json("Bạn chưa được xác thực!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token không được xác thực!");
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      console.log(err);
    }
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    res.status(200).json({ token: newAccessToken });
  });
};

// LOGOUT
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

    res.status(201).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Có lỗi ở đâu đó!" }); // Co loi o dau do
  }
};
const getUser = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
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
    const Info = {
      ...body,
    };
    await UserModal.updateOne({ _id: req.params.id }, Info);
    res.status(200).json(Info);
  } catch (error) {
    res.status(404).json({ message: "Lỗi ở đâu đó!" });
  }
};

module.exports = { signup, signin, getUser, editUser, reqRefreshToken };
