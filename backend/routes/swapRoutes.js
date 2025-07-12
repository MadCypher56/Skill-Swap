import express from 'express';
import {
    sendSwapRequest,
    getSwapRequests,
    respondToSwapRequest,
    deleteSwapRequest
  } from '../controllers/swapController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getSwapRequests);
router.post('/request', verifyToken, sendSwapRequest);
router.post('/respond', verifyToken, respondToSwapRequest);
router.delete('/:requestId', verifyToken, deleteSwapRequest);

export default router;
  