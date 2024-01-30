import express from 'express';
import { test, updateUserInfo } from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const userRouter = express.Router();

userRouter.get('/test',test)
userRouter.post('/update/:id',verifyToken,updateUserInfo);


export default userRouter;