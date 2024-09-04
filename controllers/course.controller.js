import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import CourseModel from "../models/course.model.js";
import { errorRes, successRes } from "../utils/cusResponse.js";
import mongoose from "mongoose";
import { decodedToken } from "../utils/decodedToken.js";
import { sendMsg } from "../utils/sendMsg.js";
import axios from "axios";
export const store = asyncHandler(async (req, res) => {
  const data = req.body;
  if (data?.thumbnail) {
    const myCLoud = await cloudinary.v2.uploader.upload(data?.thumbnail, {
      folder: "avatars",
      width: 500,
    });
    data.thumbnail = {
      public_id: myCLoud.public_id,
      url: myCLoud.url,
    };
  }
  const course = await CourseModel.create(data);
  res.status(201).json(successRes("new course created", course));
});

export const index = asyncHandler(async (req, res) => {
  const courses = await CourseModel.find().select(
    "-courseData.data.videoUrl -courseData.data.suggesstion -courseData.data.question"
  );
  res.status(200).json(successRes("success get courses data", courses));
});

export const getAllCourse = asyncHandler(async (req, res) => {
  const courses = await CourseModel.find();
  res.status(200).json(successRes("success get courses data", courses));
});

export const getCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await CourseModel.findById(id).select(
    "-courseData.videoUrl -courseData.suggestion -courseData.questions"
  );
  res.status(200).json(successRes("success get course data", course));
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await CourseModel.findByIdAndDelete(id);
  res.status(204).json(successRes("success "));
});

export const getCourseByUser = asyncHandler(async (req, res) => {
  const { id: courseId } = req.params;
  const user = await decodedToken(req, res);
  const courseList = user?.courses;
  const courseExist = courseList.find(
    (course) => course._id.toString() == courseId
  );
  if (!courseExist) {
    res
      .status(400)
      .json(errorRes("Your are not eligible to access this course"));
  }
  const course = await CourseModel.findById(courseId);
  res.status(200).json(successRes("success get course data", course));
});

export const updateCourse = asyncHandler(async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  if (
    typeof data?.thumbnail === "string" &&
    data.thumbnail.startsWith("data")
  ) {
    const myCLoud = await cloudinary.v2.uploader.upload(data?.thumbnail, {
      folder: "avatars",
      width: 500,
    });
    data.thumbnail = {
      public_id: myCLoud.public_id,
      url: myCLoud.url,
    };
  }
  const course = await CourseModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );
  res.status(201).json(successRes("new course updated", course));
});

export const addQuestion = asyncHandler(async (req, res) => {
  const { contentId, question, dataId } = req.body;
  const { id: courseId } = req.params;
  const user = await decodedToken(req, res);
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400).json(errorRes("course id wrong"));
  }
  const course = await CourseModel.findById(courseId);
  const content = course.courseData.find((c) => c._id.equals(contentId));
  const data = content.data.find((c) => c._id == dataId);
  if (!content || !data) {
    res.json(errorRes("not found data"));
  }
  const newQuestion = {
    user: user,
    question,
  };
  data.question.push(newQuestion);
  await course.save();
  res.status(201).json(successRes("success", course));
});

export const replyQuestion = asyncHandler(async (req, res) => {
  const { contentId, dataId, questionId, reply } = req.body;
  const { id: courseId } = req.params;
  const user = await decodedToken(req, res);
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400).json(errorRes("course id wrong"));
  }
  const course = await CourseModel.findById(courseId);
  const content = course.courseData.find((c) => c._id.equals(contentId));
  const data = content.data.find((q) => q._id.equals(dataId));
  const question = data.question.find((q) => q._id == questionId);
  if (!question) {
    res.status(400).json(errorRes("not found data"));
  }
  if (question.user._id == user._id) {
    // notification
  } else {
    const title = content.title;
    const data = {
      user: { name: question.user.name },
      title,
    };
    /**email,html,data */
    await sendMsg(question.user.email, "question-reply.ejs", data);
  }
  const replyQuestion = {
    user: user,
    reply,
  };
  await question.questionReplies.push(replyQuestion);
  course.save();
  res.status(201).json(successRes("success", course));
});

export const addReview = asyncHandler(async (req, res) => {
  const { id: courseId } = req.params;
  const user = await decodedToken(req, res);
  const courseList = user?.courses;
  const courseExist = courseList.some(
    (course) => course._id.toString() == courseId
  );
  if (!courseExist) {
    res
      .status(400)
      .json(errorRes("Your are not eligible to access this course"));
  }
  const course = await CourseModel.findById(courseId);
  const { review, rating } = req.body;
  const reviewData = {
    user,
    comment: review,
    rating,
    commentReplies: [],
  };
  course?.reviews.push(reviewData);
  let avg = 0;
  course.reviews.forEach((c) => (avg += c.rating));
  course.ratings = avg / course.reviews.length;
  await course.save();
  res.status(201).json(successRes("success", course));
});

export const replyReview = asyncHandler(async (req, res) => {
  const user = await decodedToken(req, res);
  const { id: courseId } = req.params;
  const { comment, reviewId } = req.body;
  const course = await CourseModel.findById(courseId);
  const review = course.reviews.find((review) => review._id == reviewId);
  review.commentReplies.push({
    user,
    comment,
  });
  await course.save();
  res.status(201).json(successRes("success", course));
});

export const generateVideoUrl = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  try {
    const response = await axios.post(
      `https://www.vdocipher.com/api/videos/${videoId}/otp`,
      { ttl: 300 },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching video URL:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching video URL", error: error.message });
  }
});
