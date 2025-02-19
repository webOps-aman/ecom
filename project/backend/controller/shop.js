const express = require("express");
const path = require("path");
const router = express.Router();
const Shop = require("../model/shop");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/auth");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const multer = require("multer");


// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

router.post("/create-shop", upload.single("file"), catchAsyncErrors(async (req, res, next) => {
    try {
        console.log("📩 Form Data Received:", req.body);  // ✅ Debug form data
        console.log("📂 Uploaded File:", req.file);  // ✅ Debug file upload

        if (!req.file) {
            return next(new ErrorHandler("⚠️ File is required", 400));
        }

        const filename = req.file.filename;
        const fileUrl = `/uploads/${filename}`;

        console.log("✅ Generated Avatar URL:", fileUrl); // ✅ Debug image URL

        const seller = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            avatar: fileUrl, // ✅ Set avatar URL
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode,
        };

        console.log("📦 Seller Data Before Token:", seller); // ✅ Debug data before sending token

        const activationToken = createActivationToken(seller);
        console.log("🔑 Activation Token:", activationToken); // ✅ Debug token

        const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

        await sendMail({
            email: seller.email,
            subject: "Activate your shop",
            message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
        });

        res.status(201).json({
            success: true,
            message: `Please check your email (${seller.email}) to activate your shop.`,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));



// Create activation token
const createActivationToken = (seller) => {
    return jwt.sign(
        {
            name: seller.name,
            email: seller.email,
            password: seller.password,
            avatar: seller.avatar, // ✅ Avatar जोड़ो
            address: seller.address,
            phoneNumber: seller.phoneNumber,
            zipCode: seller.zipCode,
        },
        process.env.ACTIVATION_SECRET,
        { expiresIn: "1d" }
    );
};


// Activate shop
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
    try {
        const { activation_token } = req.body;
        if (!activation_token) {
            return next(new ErrorHandler("Activation token is required", 400));
        }

        let newSeller;
        try {
            newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
        } catch (error) {
            return next(new ErrorHandler("Your token has expired. Please request a new activation link.", 400));
        }

        const { name, email, password, avatar, zipCode, address, phoneNumber } = newSeller;
        let seller = await Shop.findOne({ email });

        if (seller) {
            return next(new ErrorHandler("Shop already exists", 400));
        }

        console.log(
            name,
            email,
            avatar,
            password,
            zipCode,
            address,
            phoneNumber,
        );

        seller = await Shop.create({
            name,
            email,
            avatar,
            password,
            zipCode,
            address,
            phoneNumber,
        });

        sendToken(seller, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

module.exports = router;
