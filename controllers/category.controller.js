import asyncHandler from "express-async-handler";
import CateModel from "../models/category.model.js";
import { successRes } from "../utils/cusResponse.js";

export const all = asyncHandler(async (req, res) => {
  const cates = await CateModel.find();
  res.status(200).json(successRes("success", cates));
});

export const store = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const newcate = await CateModel.create({ title });
  res.status(201).json(successRes("success", newcate));
});

export const update = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const updateCate = await CateModel.findByIdAndUpdate(req.params.id, {
    title,
  });
  res.status(200).json(successRes("success update", updateCate));
});

export const destroy = asyncHandler(async (req, res) => {
  const updateCate = await CateModel.findByIdAndDelete(req.params.id);
  res.status(204).json(successRes("success", updateCate));
});
