require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/jwtSecret");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Needs Token" });
  }

  const jwtSecret = getJwtSecret();
  if (!jwtSecret) {
    return res.status(500).json({ error: "JWT secret is missing in backend .env" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
