import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";



// middleware for user so oonly they can access there own chats 

async function userAuthMiddleware(req, res, next) {
    const token = req.cookies.token;
    if(!token){
        return res.status(400).json({message: "please login first"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await userModel.findById(decoded.id)

        req.user = user;
        next();
    } catch (error) {
        return res.status(404).json({message: "invalid token"})
    }
};

export default userAuthMiddleware;