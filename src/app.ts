import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoute from "./routes/auth";

dotenv.config();

import cors from "cors";
const app = express();

app.use(bodyParser.json()); // application/json

app.use(cors());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({ message: message });
  next();
});

app.use("/user", userRoute);

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.CONNECTION_URL!)
  .then(() => {
    app.listen(3001);
    console.log("listening at port 3001.....");
  })
  .catch((err) => {
    console.log(err);
  });
