import express from "express";
import passport from "../../config/passport.js";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";

const router = express.Router();

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req: any, res) => {
    console.log("Callback hit");
    console.log("User from passport:", req.user);
    const accessToken = jwt.sign(
      { _id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15min" },
    );

    const refreshToken = jwt.sign(
      { _id: req.user._id, role: req.user.role },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" },
    );

    //refresh token in the DB
    req.user.refreshToken = refreshToken;
    await req.user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.redirect(`${process.env.FRONTEND_URL}/admin`);
  },
);

router.get("/me", async (req: any, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
    };
    const user = await User.findById(decoded._id).select("_id name email role");
    if (!user) return res.status(401).json({ message: "User not found" });
    return res.json(user);
  } catch {
    return res.status(401).json({ message: "Invalid access token" });
  }
});

router.get("/refresh", async (req: any, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
      _id: string;
    };

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Invalid refresh token" });

    // Issue new access token
    const newAccessToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({ message: "Access token refreshed" });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

// Logout
router.get("/logout", async (req: any, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = "";
      await user.save();
    }
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.json({ ok: true });
});

export default router;
