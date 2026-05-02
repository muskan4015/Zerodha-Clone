require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { getJwtSecret } = require("../config/jwtSecret");
const { UserModel } = require("../model/UserModel");

const createToken = (email) => {
  const jwtSecret = getJwtSecret();

  if (!jwtSecret) {
    throw new Error("JWT secret is missing");
  }

  return jwt.sign({ email }, jwtSecret);
};

module.exports.register = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Enter valid details" });
    }

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = createToken(newUser.email);
    res.status(200).json({ token, username: newUser.username, email: newUser.email });
  } catch (error) {
    console.error(error);
    if (error.message === "JWT secret is missing") {
      return res.status(500).json({ error: "JWT secret is missing in backend .env" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const identifier = req.body.email?.trim();
    const normalizedIdentifier = identifier?.toLowerCase();
    const password = req.body.password?.trim();

    if (!identifier || !password) {
      return res.status(400).json({ error: "Enter email/username and password" });
    }

    const user = await UserModel.findOne(
      identifier.includes("@")
        ? { email: normalizedIdentifier }
        : { username: identifier }
    ).sort({ _id: -1 });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = createToken(user.email);
    res.status(200).json({ token, username: user.username, email: user.email });
  } catch (error) {
    console.error(error);
    if (error.message === "JWT secret is missing") {
      return res.status(500).json({ error: "JWT secret is missing in backend .env" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
