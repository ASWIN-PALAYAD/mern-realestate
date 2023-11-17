import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async(req,res,next)=> {
    console.log(req.body);
    const {username,password,email} = req.body;

    const userExist = await User.findOne({username});
    if(userExist){
        next(errorHandler(508,"user already registerd"))
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = new User({ 
        username,password:hashedPassword,email 
    })
    
    try {
        await newUser.save(); 
        res.status(201).json({
            message:"user Created",
            data:newUser
        })
    } catch (error) {
        next(error)
    }
}