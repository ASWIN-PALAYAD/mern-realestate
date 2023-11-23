import express from 'express';
import dbConnect from './config/dbConnect.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import cors from 'cors';

const app = express();
app.use(cors());


app.use(express.json());



//routes
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);


//middleware
app.use((err,req,res,next)=>{
    const statusCode = err?.statusCode || 500;
    const message = err?.message ? err?.message : "internal server error"
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})







//create server
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=> {
    dbConnect();
    console.log(`server is running on port  ${PORT}`);
});
