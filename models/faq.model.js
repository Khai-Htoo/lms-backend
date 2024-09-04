import mongoose, { Schema } from "mongoose";

const faqSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const FaqModel = new mongoose.model("Faq", faqSchema);
export default FaqModel;
