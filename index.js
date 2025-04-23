import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Load environment variables
dotenv.config({ path: ".env" });

// Set up port
const PORT = process.env.PORT || 3000;

// Connect to the database
databaseConnection();

// Initialize express app
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup
const allowedOrigins = [
  'http://localhost:3000',
  'https://serene-daffodil-5eaf62.netlify.app',
  'https://cozy-medovik-9166c3.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ Use same options for preflight

// Optional: Logging middleware for debugging
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  console.log("Request Cookies:", req.cookies);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to API");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// import express from "express";
// import dotenv from "dotenv";
// import databaseConnection from "./config/database.js";
// import cookieParser from "cookie-parser";
// import userRoute from "./routes/userRoute.js";
// import tweetRoute from "./routes/tweetRoute.js";
// import cors from "cors";

// dotenv.config({ path: ".env" });
// const port = process.env.PORT || 4000;
// // Connect to DB
// databaseConnection();

// const app = express();

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());

// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://serene-daffodil-5eaf62.netlify.app'
 
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));


// app.get('/',(req,res)=>{
//   res.send("Welcome to the API")
// })

// // Routes
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/tweet", tweetRoute);

// // Start Server
// app.listen(process.env.PORT, () => {
//   console.log(`Server listening at port ${process.env.PORT}`);
// });



