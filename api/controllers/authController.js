import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async(req,res,next)=> {
    const {username,password,email} = req.body;

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = new User({
        username,password:hashedPassword,email
    })
    
    try {
        await newUser.save();
        res.status(200).json("user created succefully")
    } catch (error) {
        next(error)
    }
}