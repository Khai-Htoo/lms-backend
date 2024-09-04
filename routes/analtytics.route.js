import express from "express";
import {
  courseAnaltytics,
  orderAnaltytics,
  userAnaltytics,
} from "../controllers/analtytics.controller.js";
const analtyticsRouter = express.Router();
analtyticsRouter.get("/users", userAnaltytics);
analtyticsRouter.get("/orders", orderAnaltytics);
analtyticsRouter.get("/courses", courseAnaltytics);

export default analtyticsRouter;
