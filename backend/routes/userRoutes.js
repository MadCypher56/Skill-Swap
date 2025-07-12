import express from 'express';
import { updateProfile, getProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getPublicUsers } from '../controllers/userController.js'; 

const router = express.Router();

// Get profile - protected route
router.get('/profile', verifyToken, getProfile);

// Update profile - protected route
router.put('/profile', verifyToken, updateProfile);
router.get('/public-users', verifyToken, getPublicUsers);

export default router;
