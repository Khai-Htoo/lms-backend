import asyncHandler from "express-async-handler";
import NotificationModel from "../models/Notification.model.js";
import { successRes } from "../utils/cusResponse.js";

export const getAllNoti = asyncHandler(async (req, res) => {
  const notifications = await NotificationModel.find().sort({ createdAt: -1 });
  res.status(200).json(successRes("success", notifications));
});
