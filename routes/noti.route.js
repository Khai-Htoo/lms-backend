import express from "express";
import { getAllNoti } from "../controllers/notification.controller.js";
const notiRouter = express.Router();

notiRouter.get("/allNoti", getAllNoti);
export default notiRouter;
