import mongoose, { Schema } from "mongoose";

const NotiSchema = new Schema(
  {
    user: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "unread",
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", NotiSchema);
export default NotificationModel;
