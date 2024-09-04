import UserModel from "../models/user.model.js";
import { errorRes, successRes } from "../utils/cusResponse.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendMsg } from "../utils/sendMsg.js";
import { redis } from "../utils/redis.js";
import { decodedToken } from "../utils/decodedToken.js";
import cloudinary from "cloudinary";
import axios from "axios";

// register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existUser = await UserModel.findOne({ email: email });
  if (existUser) {
    res.status(404).json(errorRes("User already exist"));
  }
  const user = {
    name,
    email,
    password,
  };
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  var token = jwt.sign({ code, user }, process.env.SECRET_KEY);
  res.cookie("activateCode", token, { httpOnly: true, expiresIn: "10m" });
  const data = { user: { name: user.name }, code };
  await sendMsg(email, "activate-code.ejs", data);
  res
    .status(200)
    .json(
      successRes("activate code successfully sent, Check your email", token)
    );
});

// activate account
export const activateAccount = asyncHandler(async (req, res) => {
  const { code, user } = jwt.verify(req.body.token, process.env.SECRET_KEY);
  if (!code) {
    res.status(400).json(errorRes("Something wrong"));
  }
  if (code != req.body.code) {
    res.status(400).json(errorRes("Your activate code is wrong"));
    return;
  }
  await UserModel.create({
    name: user.name,
    email: user.email,
    password: bcrypt.hashSync(user.password, 10),
  });
  res.status(200).json(successRes("successfully activate account"));
});

// login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json(errorRes("All field is required"));
  }
  const user = await UserModel.findOne({ email });
  if (!user) res.status(400).json(errorRes("email or password incorrect"));
  if (!bcrypt.compareSync(password, user.password)) {
    res.status(400).json(errorRes("email or password incorrect"));
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
  res.cookie("token", token, { httpOnly: true, expiresIn: "7d" });
  await redis.set(user._id, JSON.stringify(user));
  res.json(successRes("success login", { token, user }));
});

// get auth user
export const getAuthUser = asyncHandler(async (req, res) => {
  const user = await decodedToken(req, res);
  const authUser = await UserModel.findById(user._id).select("-password");
  res.status(200).json(successRes(" success", authUser));
});

// logout
export const logout = asyncHandler(async (req, res) => {
  const user = await decodedToken(req, res);
  redis.del(user._id);
  res.clearCookie("token");
  res.status(204).json(successRes("logout success"));
});

//change password
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await decodedToken(req, res);
  if (!bcrypt.compareSync(oldPassword, user.password)) {
    res.status(400).json(errorRes("password wrong"));
  }
  await UserModel.findByIdAndUpdate(user._id, {
    password: bcrypt.hashSync(newPassword, 10),
  });
  res.status(200).json(successRes("successfully changed"));
});

// update profile
export const uploadProfile = asyncHandler(async (req, res) => {
  const { avatar } = req.body;
  const user = await decodedToken(req, res);
  if (user?.avatar?.public_id) {
    await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
  }
  const myCLoud = await cloudinary.v2.uploader.upload(avatar, {
    folder: "avatars",
    width: 150,
  });
  const authUser = await UserModel.findById(user._id);
  authUser.avatar = {
    public_id: myCLoud.public_id,
    url: myCLoud.secure_url,
  };
  await authUser.save();
  res.json(successRes("successfully upload", authUser.avatar));
});

export const getAllUser = asyncHandler(async (req, res) => {
  const users = await UserModel.find()
    .sort({ createdAt: -1 })
    .select("-password -__v");
  res.json(successRes("successfully upload", users));
});

export const roleUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id).select("-password");
  if (!user) {
    res.status(400).json(errorRes("user not found"));
  }
  user.role = req.body.role;
  await user.save();
  res.json(successRes("successfully role update", user));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    res.status(400).json(errorRes("user not found"));
  }
  redis.del(id);
  await user.deleteOne();
  res.status(204).json(successRes("successfully delete"));
});
