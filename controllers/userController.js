import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ========== Register ==========
export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
                success: false,
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 16);

        await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ========== Login ==========
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true,
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ========== Logout ==========
export const logout = (req, res) => {
    return res
        .cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
        })
        .json({
            message: "User logged out successfully",
            success: true,
        });
};

// ========== Get My Profile ==========
export const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");

        return res.status(200).json({
            user,
            success: true,
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ========== Follow ==========
export const follow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);

        if (!user.followers.includes(loggedInUserId)) {
            await user.updateOne({ $push: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $push: { following: userId } });
        } else {
            return res.status(400).json({
                message: `User already followed ${user.name}`,
                success: false,
            });
        }

        return res.status(200).json({
            message: `${loggedInUser.name} just followed ${user.name}`,
            success: true,
        });
    } catch (error) {
        console.error("Follow Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ========== Unfollow ==========
export const unfollow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);

        if (loggedInUser.following.includes(userId)) {
            await user.updateOne({ $pull: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $pull: { following: userId } });
        } else {
            return res.status(400).json({
                message: "User has not followed yet",
                success: false,
            });
        }

        return res.status(200).json({
            message: `${loggedInUser.name} unfollowed ${user.name}`,
            success: true,
        });
    } catch (error) {
        console.error("Unfollow Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ========== Get Other Users ==========
export const getOtherUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const otherUsers = await User.find({ _id: { $ne: id } }).select("-password");

        if (!otherUsers || otherUsers.length === 0) {
            return res.status(404).json({
                message: "No users found",
                success: false,
            });
        }

        return res.status(200).json({
            otherUsers,
            success: true,
        });
    } catch (error) {
        console.error("Get Other Users Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ========== Bookmark ==========
export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;

        const user = await User.findById(loggedInUserId);

        if (user.bookmarks.includes(tweetId)) {
            // Remove bookmark
            await User.findByIdAndUpdate(loggedInUserId, {
                $pull: { bookmarks: tweetId },
            });
            return res.status(200).json({
                message: "Removed from bookmarks.",
                success: true,
            });
        } else {
            // Add bookmark
            await User.findByIdAndUpdate(loggedInUserId, {
                $push: { bookmarks: tweetId },
            });
            return res.status(200).json({
                message: "Saved to bookmarks.",
                success: true,
            });
        }
    } catch (error) {
        console.error("Bookmark Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};


// import { User } from "../models/userSchema.js";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";
// import dotenv from 'dotenv';
// dotenv.config();



// export const Register = async (req, res) => {
//     try {
//         const { name, username, email, password } = req.body;
//         //basic validation

//         if (!name || !username || !email || !password) {
//             return res.status(401).json({
//                 message: "all fields are required"
//             })
//         }

//         const user = await User.findOne({ email });
//         if (user) {
//             return res.status(401).json({
//                 message: "user already exist",
//                 successs: false
//             })
//         }
//         const hashedPassword = await bcryptjs.hash(password, 16)


//         await User.create({
//             name,
//             username,
//             email,
//             password: hashedPassword
//         });
//         return res.status(201).json({
//             message: "account  creted succesfully",
//             successs: true
//         })
//     } catch (error) {
//         console.log(error);

//     }

// }

// export const Login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(401).json({
//                 message: "all fields are required",
//                 success: false
//             })
//         };

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({
//                 message: "incorrect email or password",
//                 successs: false
//             })

//         }
//         const isMatch = await bcryptjs.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({
//                 message: "incorrect email or password",
//                 successs: false

//             });

//         }
//         const tokenData = {
//             userId: user._id
//         }

//         const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });
//         res.cookie("token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: "None",
//             maxAge: 24 * 60 * 60 * 1000,
//         });
        
        
        
//         return res.status(201).cookie("token", token, { expiresIn: "1d", httpOnly: true }).json({
//             message: `Welcome back ${user.name}`,
//             user,
//             success: true
//         })
//     } catch (error) {
//         console.log(error);
//     }
// };


// export const logout =(req,res)=>{
//     return res.cookie("token","",{expiresIn: new Date(Date.now())}).json({
//         message:"user logged out succesfully",
//         success:true
//     })
// };

// export const getMyProfile = async (req, res) =>{
//     try{
//          const id = req.params.id;
//          const user= await User.findById(id).select("-password");
//          return res.status(200).json({
//             user,
//          })
//     }catch (error){
//         console.log(error);
//     }
// };





// export const follow = async (req,res)=>{
//     try {
//         const loggedInUserId = req.body.id;
//         const userId = req.params.id;
//         const loggedInUser = await User.findById(loggedInUserId)
//         const user = await User.findById(userId);
//         if(!user.followers.includes(loggedInUserId)){
//             await user.updateOne({$push:{followers:loggedInUserId}});
//             await loggedInUser.updateOne({$push:{following:userId}});
//         }else{
//             return res.status(400).json({
//                 message:`user already followed to ${user.name}`
//             })
//         };
//         return res.status (200).json({
//             message:`${loggedInUser.name}just followed to ${user.name}`,
//             success:true
//         })

//     } catch (error){
//         console.log(error);
//     }
// };


// export const unfollow = async (req,res)=>{
//     try {
//         const loggedInUserId = req.body.id;
//         const userId = req.params.id;
//         const loggedInUser = await User.findById(loggedInUserId)
//         const user = await User.findById(userId);
//         if(loggedInUser.following.includes(userId)){
//             await user.updateOne({$pull:{followers:loggedInUserId}});
//             await loggedInUser.updateOne({$pull:{following:userId}});
//         }else{
//             return res.status(400).json({
//                 message:`user has not followed yet`
//             })
//         };
//         return res.status (200).json({
//             message:`${loggedInUser.name} unfollow to ${user.name}`,
//             success:true
//         })

//     } catch (error) {
//         console.log(error);
//     }
// };

// export const getOtherUsers = async (req,res) =>{ 
//     try {
//          const {id} = req.params;
//          const otherUsers = await User.find({_id:{$ne:id}}).select("-password");
//          if(!otherUsers){
//             return res.status(401).json({
//                 message:"Currently do not have any users."
//             })
//          };
//          return res.status(200).json({
//             otherUsers
//         })
//     } catch (error) {
//         console.log(error);
//     }
// };


// export const bookmark = async (req, res) => {
//     try {
//         const loggedInUserId = req.body.id;
//         const tweetId = req.params.id;
//         const user = await User.findById(loggedInUserId);
//         if (user.bookmarks.includes(tweetId)) {
//             // remove
//             await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
//             return res.status(200).json({
//                 message: "Removed from bookmarks."
//             });
//         } else {
//             // bookmark
//             await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
//             return res.status(200).json({
//                 message: "Saved to bookmarks."
//             });
//         }
//     } catch (error) {
//         console.log(error);
//     }
// };