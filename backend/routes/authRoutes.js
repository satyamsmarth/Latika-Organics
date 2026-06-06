const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { Resend } = require("resend");

const User = require("../models/User");

const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   SEND OTP
========================= */
router.post("/send-otp", async (req, res) => {
  try {
    console.log("➡️ SEND OTP API HIT");

    const { phone, email } = req.body;

    console.log("📱 PHONE:", phone);
    console.log("📧 EMAIL:", email);

    if (!phone) {
      return res.status(400).json({
        message: "Phone is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    let user = await User.findOne({ phone });

    console.log("👤 USER FOUND:", user ? "YES" : "NO");

    if (!user) {
      console.log("🆕 CREATING NEW USER");

      user = new User({
        phone,
        email,
        name: "",
        role: "user",
      });
    }

    user.email = email || user.email;

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("🔢 GENERATED OTP:", otp);

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log("✅ USER SAVED WITH OTP");

    try {
      console.log("📧 SENDING OTP VIA RESEND");

      const { data, error } = await resend.emails.send({
        from: "Latika Gruh Udyog <orders@latikagruhudyog.in>",
        to: email,
        subject: "Your Latika Organics OTP",
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px">
            <h2>🌿 Latika Organics</h2>

            <p>Your OTP for login/signup is:</p>

            <div style="
              font-size:32px;
              font-weight:bold;
              letter-spacing:6px;
              color:#16a34a;
              margin:20px 0;
            ">
              ${otp}
            </div>

            <p>This OTP is valid for 5 minutes.</p>

            <p>
              If you did not request this OTP,
              please ignore this email.
            </p>
          </div>
        `,
      });

      if (error) {
        console.log("❌ RESEND ERROR:", error);

        return res.status(500).json({
          message: "Failed to send email OTP",
          error,
        });
      }

      console.log("📧 OTP EMAIL SENT");
      console.log(data);

    } catch (mailError) {
      console.log("❌ EMAIL SEND ERROR:", mailError);

      return res.status(500).json({
        message: "Failed to send email OTP",
        error: mailError.message,
      });
    }

    return res.json({
      success: true,
      message: "OTP Sent",
    });

  } catch (err) {
    console.log("❌ SEND OTP ERROR:", err);

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

/* =========================
   VERIFY OTP
========================= */
router.post("/verify-otp", async (req, res) => {
  try {
    console.log("➡️ VERIFY OTP API HIT");

    const { phone, otp, name, email } = req.body;

    console.log("📱 PHONE:", phone);
    console.log("🔢 OTP RECEIVED:", otp);

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    user.name = name || user.name || "";
    user.email = email || user.email || "";

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    console.log("✅ USER VERIFIED");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      role: user.role || "user",
      user: {
        _id: user._id,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone,
        role: user.role || "user",
      },
    });

  } catch (err) {
    console.log("❌ VERIFY OTP ERROR:", err);

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;