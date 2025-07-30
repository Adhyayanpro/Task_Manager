import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { signToken } from "../utils/jwt";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already used" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed }); 
  await user.save();
  res.status(201).json({ message: "User registered" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = signToken({ id: user._id });
  res.json({ token });
};
