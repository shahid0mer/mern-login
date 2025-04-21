import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";

import connectdb from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoute.js";

const app = express();

const PORT = process.env.PORT || 7000;

await connectdb();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-login-frontend-uxov.onrender.com",
    ],
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hellooooooo");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`server running on :http://localhost:${PORT}`);
});
