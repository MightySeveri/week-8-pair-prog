const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateToken = (_id) => jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });

// POST /api/users/signup
const signupUser = async (req, res) => {
  const fullName = req.body.fullName || req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber || req.body.phone_number;
  const gender = req.body.gender;
  const date_of_birth = req.body.date_of_birth;
  const accountType = req.body.accountType || req.body.membership_status;

  try {
    if (!fullName || !email || !password || !phoneNumber || !gender || !date_of_birth || !accountType) {
      return res.status(400).json({ error: "Please add all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      gender,
      date_of_birth,
      accountType,
    });

    const token = generateToken(user._id);
    res.status(201).json({ email: user.email, token });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(400).json({ error: error.message });
  }
};

// POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({ email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
};
