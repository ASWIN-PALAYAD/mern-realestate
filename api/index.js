import express from 'express';
import dbConnect from './config/dbConnect.js';

const app = express();






//create server
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> {
    dbConnect();
    console.log(`server is running on port  ${PORT}`);
});
