const express = require("express");
const path = require('path');
const router = express.Router();
const User = require('../model/user');
const {upload} = require('../multer');
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require("../utils/jwtToken");




router.post('/create-user', upload.single("file"), async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    if (!req.file) {
      return next(new ErrorHandler('File is required', 400));
    }

    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {  
      return next(new ErrorHandler('User already exists', 400));
    }

    const filename = req.file.filename;
    const fileUrl = `/uploads/${filename}`; // Ensure correct path

    const newUser = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: filename,
        url: fileUrl,
      },
    });

    // res.status(201).json({
    //   success: true,
    //   message: "User created successfully",
    //   user: newUser,
    // });

    const activationToken = createActivationToken(newUser);
    console.log("Generated Activation Token:", activationToken);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {

      await sendMail({
        email: newUser.email,
        subject: "Activate your account",
        message: `Hello ${newUser.name}, please click on the link to activate your account: ${activationUrl}`
      });

      res.status(201).json({
        success: true, 
        message: `Please check your email:- ${newUser.email} to activate your account`
      })

    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message,500));
    }

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// create activation token
const createActivationToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    }, 
    process.env.ACTIVATION_SECRET, 
    { expiresIn: "1d" }
  );
};



// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      console.log("Received Activation Token in Backend:", activation_token); // ✅ Debug

      let newUser;
      try {
        newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
        console.log("Decoded Token Data:", newUser); // ✅ Check if decoding works
      } catch (error) {
        console.log("Token Verification Error:", error.message);
        return next(new ErrorHandler("Your token has expired. Please request a new activation link.", 400));
      }

      console.log("Token Expiry Time:", new Date(newUser.exp * 1000));
      console.log("Current Time:", new Date());

      const { name, email, password, avatar } = newUser;
      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      user = await User.create({
        name,
        email,
        avatar,
        password,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);





  module.exports = router;