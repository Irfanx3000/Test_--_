import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/user.model.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ======================================================
   GOOGLE LOGIN
====================================================== */
export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken)
      return res.status(400).json({ message: "No token provided" });

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    let { email, name, picture } = payload;

    // Normalize email
    email = email.toLowerCase().trim();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        isVerified: true,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      token,
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};


/* ======================================================
   REGISTER USER (EMAIL + PASSWORD)
====================================================== */
export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // Normalize email
    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    res.status(201).json({
      message: "Registration successful",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};


/* ======================================================
   EMAIL LOGIN
====================================================== */
export const emailLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // Normalize email
    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.password)
      return res.status(400).json({ message: "Please login using Google" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};