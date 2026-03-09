const express = require("express");
const router = express.Router();
const { signupUser, loginUser } = require("../controllers/userController");

// POST /api/users/signup
router.post("/signup", signupUser);

// POST /api/users/login
router.post("/login", loginUser);

module.exports = router;
