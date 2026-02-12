import express from "express";
import passport from "../../config/passport.js";
import jwt from "jsonwebtoken";

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
  (req: any, res) => {
    console.log("Callback hit");
    console.log("User from passport:", req.user);
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  },
);

router.get("/test", (req, res) => {
  res.send("Auth route works");
});
// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return err.message;
    res.clearCookie("token");
    res.redirect("/login");
  });
});

export default router;
