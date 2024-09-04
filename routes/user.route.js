import express from "express";
import {
  activateAccount,
  changePassword,
  deleteUser,
  getAllUser,
  getAuthUser,
  login,
  logout,
  register,
  roleUpdate,
  uploadProfile,
} from "../controllers/user.controller.js";
import { checkAuth, isAdmin } from "../middlewares/auth.js";
const userRouter = express.Router();
userRouter.post("/register", register);
userRouter.post("/activate-code", activateAccount);
userRouter.post("/login", login);
userRouter.get("/me", getAuthUser);
userRouter.post("/logout", checkAuth, logout);
userRouter.post("/change-password", checkAuth, changePassword);
userRouter.post("/upload-profile", checkAuth, uploadProfile);
userRouter.get("/users", checkAuth, isAdmin, getAllUser);
userRouter.put("/user/:id", checkAuth, isAdmin, roleUpdate);
userRouter.delete("/user/:id", checkAuth, isAdmin, deleteUser);

export default userRouter;
