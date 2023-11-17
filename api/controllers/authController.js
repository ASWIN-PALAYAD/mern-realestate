import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//user sign up
export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, password, email } = req.body;

  const userExist = await User.findOne({ username });
  if (userExist) {
    next(errorHandler(508, "user already registerd"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    email,
  });

  try {
    await newUser.save();
    res.status(201).json({
      message: "user Created",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

//user sign in
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = await bcrypt.compare(password, validUser?.password);
    if (!validPassword) {
     return next(errorHandler(404, "Invalid Credentials"));
    }

    const token = jwt.sign({ id: validUser?._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    const {password:pass,...userDetails} = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json(userDetails);
  } catch (error) {
    next(error);
  }
};
