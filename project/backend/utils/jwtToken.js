// create token and save in cookies
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "PRODUCTION", // Localhost पर false, Production पर true
  };

  // Debugging Logs
  console.log("Generated Token:", token);
  console.log("Setting Cookie:", { token, options });

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
