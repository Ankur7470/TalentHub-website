import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong password or username!"));

    // const token = jwt.sign(
    //   { id: user._id, role: user.role },
    //   process.env.JWT_KEY,
    //   { expiresIn: "1d" }
    // );

    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller }, 
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    const { password, ...info } = user._doc;

    res.status(200).json({ token, user: info });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return next(createError(404, "User not found!"));
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  // Just a dummy route if you want to call /logout from frontend
  res.status(200).send("User logged out");
};

// export const forgotPassword = async (req, res, next) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const token = crypto.randomBytes(32).toString("hex");
//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();

//     const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
//     const message = `Reset your password by clicking the link: ${resetUrl}`;

//     await sendEmail({
//       to: user.email,
//       subject: "Password Reset",
//       text: message,
//     });

//     res.status(200).json({ message: "Password reset email sent" });
//   } catch (err) {
//     next(err);
//   }
// };


// export const resetPassword = async (req, res, next) => {
//   const { token } = req.params;
//   const { password } = req.body;
//   try {
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });
//     if (!user) return res.status(400).json({ message: "Invalid or expired token" });

//     user.password = bcrypt.hashSync(password, 5);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.status(200).json({ message: "Password has been reset" });
//   } catch (err) {
//     next(err);
//   }
// };



