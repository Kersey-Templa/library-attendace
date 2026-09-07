const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const authService = require("../services/auth-service.js");

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await authService.signIn(username, password);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Sign-in successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Sign-in error:", error);

    return req.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: error.message || ReasonPhrases.UNAUTHORIZED,
    });
  }
};

module.exports = {
  signIn,
};