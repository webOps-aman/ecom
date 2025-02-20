const sendShopToken = (user, statusCode, res) => {
    const token = user.getJwtToken(); 

    const expiresInDays = parseInt(process.env.JWT_EXPIRES) || 7; // Default to 7 days if not set properly

    const options = {
        expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000), // Ensure correct expiration format
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: "strict",
    };

    console.log("Generated Token:", token); // Debugging

    res.status(statusCode)
        .cookie("seller_token", token, options)
        .json({
            success: true,
            user,
            token,
        });
};

module.exports = sendShopToken;
