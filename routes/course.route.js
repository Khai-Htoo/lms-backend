import express from "express";
import {
  addQuestion,
  addReview,
  getAllCourse,
  getCourse,
  getCourseByUser,
  index,
  replyQuestion,
  replyReview,
  store,
  updateCourse,
  generateVideoUrl,
  deleteCourse,
} from "../controllers/course.controller.js";
import { checkAuth, isAdmin } from "../middlewares/auth.js";
const courseRouter = express.Router();

courseRouter.post("/", checkAuth, isAdmin, store);
courseRouter.get("/", index);
courseRouter.get("/all", checkAuth, isAdmin, getAllCourse);
courseRouter.get("/:id", checkAuth, getCourse);
courseRouter.delete("/:id", checkAuth, isAdmin, deleteCourse);
courseRouter.get("/content/:id", checkAuth, getCourseByUser);
courseRouter.put("/:id", checkAuth, isAdmin, updateCourse);
courseRouter.put("/addQuestion/:id", checkAuth, addQuestion);
courseRouter.put("/replyQuestion/:id", checkAuth, replyQuestion);
courseRouter.put("/addReview/:id", checkAuth, addReview);
courseRouter.post("/generateVideoUrl", generateVideoUrl);
courseRouter.put("/replyReview/:id", checkAuth, isAdmin, replyReview);

export default courseRouter;
