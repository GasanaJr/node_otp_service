const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  recipient: String,
  code: String,
  status: { type: String, default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now, expires: 300 } 
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
