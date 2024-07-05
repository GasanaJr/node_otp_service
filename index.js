const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const otpController = require("./controllers/otpController");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// DB connection

try {
  mongoose.connect(process.env.DB_URL).then(() => {
    console.log("DB connected Successfully");
  });
} catch (error) {
  console.error(error);
}

app.post("/otp/request", otpController.requestOtp);
app.post("/otp/verify", otpController.verifyOtp);

// Server initialization
app.listen(process.env.PORT, () => {
  console.log("Server started");
});
