import mongoose, { Schema } from "mongoose";

const cateSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CateModel = new mongoose.model("Category", cateSchema);
export default CateModel;
