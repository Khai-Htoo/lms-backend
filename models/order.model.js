import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    paymentInfo: {
      type: Object,
    },
  },
  { timestamps: true }
);
const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
