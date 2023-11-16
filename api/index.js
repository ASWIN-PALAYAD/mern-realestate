import express from 'express';
import dbConnect from './config/dbConnect.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = express();


app.use(express.json());



//routes
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);


//middleware
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode ? err?.statusCode :  500;
    const message = err ? err?.message : "Internal server error"
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
