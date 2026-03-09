const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateToken = (_id) => jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });

// POST /api/users/signup
const signupUser = async (req, res) => {
  const { fullName, email, password, phoneNumber, gender, date_of_birth, accountType } = req.body;

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

module.exports = {
  signupUser,
};
