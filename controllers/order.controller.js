import asyncHandler from "express-async-handler";
import { decodedToken } from "../utils/decodedToken.js";
import UserModel from "../models/user.model.js";
import CourseModel from "../models/course.model.js";
import OrderModel from "../models/order.model.js";
import { errorRes, successRes } from "../utils/cusResponse.js";
import { sendMsg } from "../utils/sendMsg.js";
import NotificationModel from "../models/Notification.model.js";
import Stripe from "stripe";
import { redis } from "../utils/redis.js";

export const order = asyncHandler(async (req, res) => {
  const { courseId, paymentInfo } = req.body;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  if (paymentInfo) {
    if ("id" in paymentInfo) {
      const paymentId = paymentInfo.id;
      const payment = await stripe.paymentIntents.retrieve(paymentId);
    }
  }
  const user = await decodedToken(req, res);
  const authUser = await UserModel.findById(user._id).select("-password");
  const courseExist = authUser?.courses.some(
    (course) => course._id == courseId
  );
  if (courseExist) {
    res.status(400).json(errorRes("Your are already purchased this course"));
    return;
  }
  const course = await CourseModel.findById(courseId);
  const order = await OrderModel.create({
    courseId,
    userId: user._id,
    paymentInfo,
  });
  course.purchased += 1;
  authUser.courses.push({ _id: courseId });
  await authUser.save();
  await course.save();
  const data = {
    user: user,
    orderId: order._id.toString().slice(0, 6),
    date: new Date().toLocaleDateString("en-Us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    item: course.name,
    price: course.price,
  };
  await NotificationModel.create({
    user: authUser,
    title: "New Order",
    message: `You have a new order from ${course.name}`,
  });
  await redis.set(authUser._id, JSON.stringify(authUser));
  await sendMsg(user.email, "order.ejs", data);
  res.status(201).json(successRes("success", course));
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  res.status(200).json(successRes("success", orders));
});

// send stripe publishble key
export const sendStripKey = asyncHandler(async (req, res) => {
  res.status(200).json({
    stripeKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// new payment
export const newPayment = asyncHandler(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const payment = await stripe.paymentIntents.create({
    currency: "usd",
    amount: req.body.amount,
    metadata: {
      company: "Kdemy",
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.status(201).json(successRes("success", payment.client_secret));
});
