import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getAllUsers,
  toggleUserBan,
  getAllSwapRequests,
  getAllFeedback,
  getPlatformAnalytics,
  getAllSkillPosts,
  deleteSkillPost,
  sendAnnouncement,
  getUserActivityReport
} from '../controllers/adminController.js';

const router = express.Router();

// Admin middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// All admin routes require authentication and admin role
router.use(verifyToken, requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Analytics
router.get('/analytics', getPlatformAnalytics);

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/ban', toggleUserBan);
router.get('/users/:userId/activity', getUserActivityReport);

// Swap requests
router.get('/swap-requests', getAllSwapRequests);

// Feedback
router.get('/feedback', getAllFeedback);

// Skill posts management
router.get('/skill-posts', getAllSkillPosts);
router.delete('/skill-posts/:postId', deleteSkillPost);

// Announcements
router.post('/announcements', sendAnnouncement);

export default router; 