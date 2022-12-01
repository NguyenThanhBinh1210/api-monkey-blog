const jwt = require("jsonwebtoken");
const middlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          res.status(403).json("Token không hợp lệ hoặc đã hết hạn!");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("Bạn chưa được xác thực! ");
    }
  },
  verifyTokenAndAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("Bạn không có quyền làm điều này!");
      }
    });
  },
  verifyTokenEditBlog: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id === req.body.userId || req.user.admin) {
        next();
      } else {
        res.status(403).json("Bạn không có quyền làm điều này!");
      }
    });
  },
};
module.exports = middlewareController;
