import express from "express";
import {
  getAllOrders,
  newPayment,
  order,
  sendStripKey,
} from "../controllers/order.controller.js";
import { checkAuth, isAdmin } from "../middlewares/auth.js";
const orderRouter = express.Router();
orderRouter.post("/", checkAuth, order);
orderRouter.get("/stripeKey", checkAuth, sendStripKey);
orderRouter.get("/", checkAuth, isAdmin, getAllOrders);
orderRouter.post("/payment", checkAuth, newPayment);

export default orderRouter;
