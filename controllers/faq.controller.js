import asyncHandler from "express-async-handler";
import FaqModel from "../models/faq.model.js";
import { successRes } from "../utils/cusResponse.js";

export const all = asyncHandler(async (req, res) => {
  const faqs = await FaqModel.find();
  return res.status(200).json(successRes("success", faqs));
});

export const store = asyncHandler(async (req, res) => {
  const { question, answer } = req.body;
  const faq = await FaqModel.create({ question, answer });
  return res.status(201).json(successRes("success", faq));
});

export const update = asyncHandler(async (req, res) => {
  const { question, answer } = req.body;
  const { id } = req.params;
  const faq = await FaqModel.findByIdAndUpdate(id, { question, answer });
  return res.status(200).json(successRes("success", faq));
});

export const destroy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const faq = await FaqModel.findByIdAndDelete(id);
  return res.status(204).json(successRes("success"));
});
