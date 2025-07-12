import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  createSkillPost,
  getAllSkillPosts,
  getMySkillPosts,
  getSkillRecommendations,
  deleteSkillPost
} from '../controllers/skillPostController.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create a skill post
router.post('/', createSkillPost);

// Get all skill posts (with optional filters)
router.get('/', getAllSkillPosts);

// Get current user's skill posts
router.get('/my-posts', getMySkillPosts);

// Get skill recommendations for current user
router.get('/recommendations', getSkillRecommendations);

// Delete a skill post
router.delete('/:postId', deleteSkillPost);

export default router; 