import express from "express";
import {
  all,
  destroy,
  store,
  update,
} from "../controllers/category.controller.js";
import { checkAuth, isAdmin } from "../middlewares/auth.js";
const cateRouter = express.Router();

cateRouter.get("/", all);
cateRouter.post("/", isAdmin, checkAuth, store);
cateRouter.put("/:id", isAdmin, checkAuth, update);
cateRouter.delete("/:id", isAdmin, checkAuth, destroy);

export default cateRouter;
