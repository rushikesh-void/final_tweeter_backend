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
const corsOptions = {
    origin:"http://localhost:3000",
    credentials:true
}

app.use(cors(corsOptions));

// app.use("/",(req,res)=>{
//     res.send("welcome to api");
// });

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