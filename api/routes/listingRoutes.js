import express from 'express';
import { createListing,deleteListing,updateListing,getSingleListing } from '../controllers/listingController.js';
import { verifyToken } from '../utils/verifyUser.js';



const router = express.Router();

router.post('/create',verifyToken,createListing);
router.delete('/delete/:id',verifyToken,deleteListing);
router.post('/update/:id',verifyToken,updateListing);
router.get('/getSingleListing/:id',getSingleListing);





export default router;