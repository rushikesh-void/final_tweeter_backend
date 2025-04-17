import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({
    path:"../config/.env"
})

const isAuthenticated = async (req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            console.error("Authentication token not found in cookies.");
            return res.status(401).json({
                message:"user not authenticated",
                success:false
            })
        }
        const decode = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decode.userId;
        next();

    }catch (error)
    {
        console.log(error);
    }
}
export default isAuthenticated;