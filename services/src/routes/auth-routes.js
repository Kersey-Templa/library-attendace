const express = require("express");
const { signIn } = require("../controller/auth-controller.js");

const router = express.Router();

router.post("/auth/sign-in", signIn);

module.exports = router;