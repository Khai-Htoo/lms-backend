import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { dbConnect } from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import courseRouter from "./routes/course.route.js";
import orderRouter from "./routes/order.route.js";
import notiRouter from "./routes/noti.route.js";
import cateRouter from "./routes/category.route.js";
import faqRouter from "./routes/faq.route.js";
import analtyticsRouter from "./routes/analtytics.route.js";
import { Server } from "socket.io";
import http from "http";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.ORIGIN],
    credentials: true,
  },
});

// Middleware
app.use(express.json({ limit: "100mb" }));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.ORIGIN],
    credentials: true,
  })
);

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A user is connected");
  socket.on("notification", (data) => {
    console.log(data, "order data");
    io.emit("newNotification", data);
  });
  socket.on("disconnect", () => {
    console.log("A user is disconnected");
  });
});

// API routes
app.use("/api/", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/orders", orderRouter);
app.use("/api/noti", notiRouter);
app.use("/api/categories", cateRouter);
app.use("/api/faqs", faqRouter);
app.use("/api/analtytics", analtyticsRouter);

const port = process.env.PORT || 400;

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  dbConnect();
});
