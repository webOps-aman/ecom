const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");
const router = express.Router();


// create coupoun code
router.post(
    "/create-coupon-code",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const isCoupounCodeExists = await CoupounCode.find({
          name: req.body.name,
        });
  
        if (isCoupounCodeExists.length !== 0) {
          return next(new ErrorHandler("Coupoun code already exists!", 400));
        }
  
        const coupounCode = await CoupounCode.create(req.body);
  
        res.status(201).json({
          success: true,
          coupounCode,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );
  
  // get all coupons of a shop
  router.get(
    "/get-coupon/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const couponCodes = await CoupounCode.find({ shopId: req.seller.id });
        res.status(201).json({
          success: true,
          couponCodes,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );




  module.exports = router;