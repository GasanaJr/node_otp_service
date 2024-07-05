const Otp = require('../models/otpModel');
const crypto = require('crypto');
require('dotenv').config();

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// Nodemailer
const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

exports.requestOtp = async (req, res) => {
  const { recipient } = req.body;
  const code = generateOtp();

  const otp = new Otp({ recipient, code });
  await otp.save();

  console.log(`Sending OTP ${code} to ${recipient}`);
  const mailOptions = {
    from: process.env.EMAIL,
    to: recipient,
    subject: "Your OTP verification code",
    text: `Your verification code is ${code}`,
  };

  await transporter.sendMail(mailOptions);

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
