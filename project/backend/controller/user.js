const express = require("express");
const path = require('path');
const router = express.Router();
const User = require('../model/user');
const {upload} = require('../multer');
const ErrorHandler = require("../utils/ErrorHandler");

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

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


  module.exports = router;