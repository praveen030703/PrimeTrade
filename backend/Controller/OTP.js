import nodemailer from "nodemailer";
import User from "../Models/User.js";

function createGmailTransporter() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    throw new Error("Email not configured: set SMTP_USER and SMTP_PASS in .env");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOtpEmail(toEmail, code) {
  const from = process.env.SMTP_USER;
  const appName = "Primetrade";
  const mail = {
    from,
    to: toEmail,
    subject: `${appName} - Your OTP Code`,
    text: `Your OTP code is ${code}. It will expire in 10 minutes.`,
    html: `<p>Your OTP code is <b>${code}</b>.</p><p>It will expire in 10 minutes.</p>`,
  };
  const transporter = createGmailTransporter();
  await transporter.sendMail(mail);
}

export const issueOtpForUser = async (user) => {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.otpCode = code;
  user.otpExpiresAt = expiresAt;
  await user.save();
  await sendOtpEmail(user.email, code);
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(200).json({ message: "Already verified" });
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      return res.status(400).json({ message: "No OTP found. Please resend." });
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ message: "OTP expired. Please resend." });
    }

    if (String(otp) !== String(user.otpCode)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(200).json({ message: "Already verified" });
    }

    await issueOtpForUser(user);
    return res.status(200).json({ message: "OTP resent to email" });
  } catch (err) {
    console.error("resendOtp error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


