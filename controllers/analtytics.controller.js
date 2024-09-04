import asyncHandler from "express-async-handler";
import { generate12MonthsData } from "../utils/analyticsGenerate.js";
import UserModel from "../models/user.model.js";
import { successRes } from "../utils/cusResponse.js";
import OrderModel from "../models/order.model.js";
import CourseModel from "../models/course.model.js";

export const userAnaltytics = asyncHandler(async (req, res) => {
  const users = await generate12MonthsData(UserModel);
  res.status(200).json(successRes("success", users));
});

export const orderAnaltytics = asyncHandler(async (req, res) => {
  const orders = await generate12MonthsData(OrderModel);
  res.status(200).json(successRes("success", orders));
});

export const courseAnaltytics = asyncHandler(async (req, res) => {
  const courses = await generate12MonthsData(CourseModel);
  res.status(200).json(successRes("success", courses));
});
