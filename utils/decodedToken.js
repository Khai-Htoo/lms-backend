import jwt from "jsonwebtoken";
import { redis } from "./redis.js";
import { errorRes } from "./cusResponse.js";
import asyncHandler from "express-async-handler";
export const decodedToken = asyncHandler(async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(400).json(errorRes("Please login first"));
  }
  let { id } = jwt.verify(token, process.env.SECRET_KEY);
  const user = await redis.get(id);
  return JSON.parse(user);
});
