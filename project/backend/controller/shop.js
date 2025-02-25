const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Shop = require("../model/shop");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const multer = require("multer");
const sendShopToken = require("../utils/shopToken");

// ✅ Create uploads directory if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// ✅ Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

// ✅ Create Shop Route
router.post("/create-shop", upload.single("file"), catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, name, password, address, phoneNumber, zipCode } = req.body;

        // Check if user already exists
        const sellerExists = await Shop.findOne({ email });
        if (sellerExists) {
            return next(new ErrorHandler("User already exists", 400));
        }

        // Check if file is uploaded
        if (!req.file) {
            return next(new ErrorHandler("File is required", 400));
        }

        const filename = req.file.filename;
        const fileUrl = `/uploads/${filename}`;

        // ✅ Send plaintext password in token (hashing nahi karna yahan)
        const seller = { name, email, password, avatar: fileUrl, address, phoneNumber, zipCode };

        const activationToken = createActivationToken(seller);
        const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

        try {
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
            console.error("Email Sending Error:", error);
            return next(new ErrorHandler("Email sending failed, please try again later.", 500));
        }
    } catch (error) {
        console.error("Create Shop Error:", error);
        return next(new ErrorHandler(error.message, 500));
    }
}));

// ✅ Create Activation Token Function
const createActivationToken = (seller) => {
    return jwt.sign(
        {
            name: seller.name,
            email: seller.email,
            password: seller.password,  // ✅ Plaintext password (hashed nahi)
            avatar: seller.avatar,
            address: seller.address,
            phoneNumber: seller.phoneNumber,
            zipCode: seller.zipCode,
        },
        process.env.ACTIVATION_SECRET,
        { expiresIn: "3d" }  // Token expires in 3 days
    );
};

// ✅ Activate Shop Route
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

        const formattedAvatar = {
            public_id: Date.now().toString(),
            url: avatar,
        };

        let seller = await Shop.findOne({ email });
        if (seller) {
            return next(new ErrorHandler("Shop already exists", 400));
        }

        // ✅ Password hashing model ke middleware me ho raha hai, yahan nahi karna
        seller = await Shop.create({
            name,
            email,
            password,  // ✅ Save plaintext password, model middleware handle karega hashing
            avatar: formattedAvatar,
            zipCode,
            address,
            phoneNumber,
        });

        sendShopToken(seller, 201, res);
    } catch (error) {
        console.error("Activation Error:", error);
        return next(new ErrorHandler(error.message, 500));
    }
}));

// ✅ Shop Login Route
router.post("/login-shop", catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please provide all fields!", 400));
        }

        const user = await Shop.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("User doesn't exist!", 400));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return next(new ErrorHandler("Incorrect credentials!", 400));
        }

        sendShopToken(user, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));


// ✅ Load Shop Route
router.get("/getSeller", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        if (!req.seller) {
            return next(new ErrorHandler("Unauthorized access! No seller found in request.", 401));
        }

        const seller = await Shop.findById(req.seller._id);

        if (!seller) {
            return next(new ErrorHandler("Seller doesn't exist", 404));
        }

        res.status(200).json({
            success: true,
            seller,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
}));




// log out from shop
router.get(
    "/logout",
    catchAsyncErrors(async (req, res, next) => {
      try {
        res.cookie("seller_token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        res.status(201).json({
          success: true,
          message: "Log out successful!",
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );




  // get shop info
router.get(
    "/get-shop-info/:id",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const shop = await Shop.findById(req.params.id);
        res.status(201).json({
          success: true,
          shop,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );



module.exports = router;
