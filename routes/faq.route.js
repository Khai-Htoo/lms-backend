import express from "express";
import { all, destroy, store, update } from "../controllers/faq.controller.js";
import { checkAuth, isAdmin } from "../middlewares/auth.js";
const faqRouter = express.Router();
faqRouter.get("/", all);
faqRouter.post("/", isAdmin, checkAuth, store);
faqRouter.put("/:id", isAdmin, checkAuth, update);
faqRouter.delete("/:id", isAdmin, checkAuth, destroy);
export default faqRouter;
