import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


// register user
export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne({ email });
  if (isAlreadyRegistered) {
    return res.status(400).json({ message: "already registered!!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  // 🔥 Proper cookie config
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });

  res.status(200).json({
    message: "registered successfully",
    user: {
      _id: user._id,
      email: user.email,
      name: user.name
    }
  });
}


// login
export async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "email or password is wrong" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  // cookie options
  res.cookie("token", token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined, 
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });

  res.status(200).json({
    message: "user logged in successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    }
  });
}

// logout
export function logoutUser(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
    path: '/',
  });
  res.status(200).json({ message: "user logged out successfully" });
}



