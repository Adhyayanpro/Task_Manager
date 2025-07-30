import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const signToken = (payload: object) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET) as any;
};
