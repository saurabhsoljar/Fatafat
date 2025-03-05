import express, { request, response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.rout.js";
import uploadRouter from "./route/upload.router.js";
import subCategoryRouter from "./route/subCategory.route.js";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

const PORT =process.env.PORT || 8080 ;

app.get("/", (request, response) => {
  //server to clint
  response.json({
    message: "server is running " + PORT,
  });
});

app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subCategoryRouter)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("server is running", PORT);
  });
});
