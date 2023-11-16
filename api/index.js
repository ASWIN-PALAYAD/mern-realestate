import express from 'express';
import dbConnect from './config/dbConnect.js';
import UserRouter from './routes/userRoutes.js';

const app = express();



//routes
app.use('/api/user',UserRouter);











//create server
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=> {
    dbConnect();
    console.log(`server is running on port  ${PORT}`);
});
