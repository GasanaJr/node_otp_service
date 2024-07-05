const Otp = require('../models/otpModel');
const crypto = require('crypto');

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

exports.requestOtp = async (req, res) => {
  const { recipient } = req.body;
  const code = generateOtp();

  const otp = new Otp({ recipient, code });
  await otp.save();

  console.log(`Sending OTP ${code} to ${recipient}`);

  res.status(200).send({ message: 'OTP sent successfully' });
};

exports.verifyOtp = async (req, res) => {
  const { recipient, code } = req.body;

  const otp = await Otp.findOne({ recipient, code, status: 'ACTIVE' });

  if (!otp) {
    return res.status(422).send({ message: 'Invalid OTP' });
  }

  otp.status = 'EXPIRED';
  await otp.save();

  res.status(200).send({ message: 'OTP verified successfully' });
};
