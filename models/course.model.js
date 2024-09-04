import mongoose, { Schema } from "mongoose";
const reviewSchema = new Schema({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [],
});

const linkSchema = new Schema({ title: String, url: String });

const questionSchema = new Schema({
  user: Object,
  question: String,
  questionReplies: [],
});

const courseDataSchema = new Schema({
  videoUrl: String,
  title: String,
  description: String,
  videoLength: String,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  question: [questionSchema],
});

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      public_id: String,
      url: String,
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [
      {
        videoSection: String,
        data: [courseDataSchema],
      },
    ],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("Course", courseSchema);

export default CourseModel;
