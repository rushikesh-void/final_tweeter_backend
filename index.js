import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import databaseConnection from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";

dotenv.config();

const app = express();

/* ======================
   CONNECT DATABASE
====================== */
databaseConnection();

/* ======================
   MIDDLEWARE (ORDER MATTERS)
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ======================
   CORS (FINAL + SAFE)
====================== */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://grand-biscuit-d27c7b.netlify.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

/* ❌ REMOVE THIS LINE (VERY IMPORTANT)
   app.options("*", cors());
*/

/* ======================
   ROUTES
====================== */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
