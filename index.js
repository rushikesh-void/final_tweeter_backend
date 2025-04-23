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



import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";

dotenv.config({
    path: ".env"
})


const PORT = process.env.PORT || 3000;


// connect to database
databaseConnection();

const app = express();


// middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());


// const corsOptions = {
//     origin:"http://localhost:3000",
//     credentials:true
// }


const allowedOrigins = [
  'http://localhost:3000',
  'https://serene-daffodil-5eaf62.netlify.app',
  "cozy-medovik-9166c3.netlify.app"
 
];

app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

// app.use(cors(corsOptions));

app.get("/",(req,res)=>{
    res.send("welcome to api");
});

app.use((req,res,next)=>{
    console.log("request Cookies", req.cookies);
    console.log("request Headers", req.headers.authorization);
    next();

});

//api routes
app.use("/api/v1/user",userRoute)
app.use("/api/v1/tweet",tweetRoute)

app.listen(process.env.PORT, () => {
    console.log(`server listen at port ${process.env.PORT}`);
})