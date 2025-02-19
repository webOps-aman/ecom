const express = require("express");
// const ErrorHandler = require("./utils/ErrorHandler");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// ✅ CORS Configuration (Ensure frontend can access backend)
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ✅ Middleware Setup
app.use(express.json({ limit: "100mb" })); // Unified JSON body parsing
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());
app.use(bodyParser.json());

// ✅ Serve static files from 'uploads' directory
app.use("/uploads", express.static("uploads"));

// ✅ Test Route (For debugging)
app.get("/test", (req, res) => {
  res.send("Hello world!");
});

// ✅ Load environment variables (only in development mode)
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/.env" });
}

// ✅ Import and use routes
const userRoutes = require("./controller/user");
const shop = require("./controller/shop");
app.use("/api/v2/user", userRoutes);
app.use("/api/v2/shop", shop);


// ✅ Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;
