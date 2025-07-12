import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  createLearningSession,
  getAllLearningSessions,
  getLearningSessionById,
  joinLearningSession,
  leaveLearningSession,
  updateLearningSession,
  deleteLearningSession
} from '../controllers/learningSessionController.js';

import {
  uploadResource,
  getSessionResources,
  updateResource,
  deleteResource,
  addResourceComment,
  getResourceComments
} from '../controllers/resourceController.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Learning Session routes
router.post('/sessions', createLearningSession);
router.get('/sessions', getAllLearningSessions);
router.get('/sessions/:sessionId', getLearningSessionById);
router.post('/sessions/:sessionId/join', joinLearningSession);
router.delete('/sessions/:sessionId/leave', leaveLearningSession);
router.put('/sessions/:sessionId', updateLearningSession);
router.delete('/sessions/:sessionId', deleteLearningSession);

// Resource routes
router.post('/sessions/:sessionId/resources', uploadResource);
router.get('/sessions/:sessionId/resources', getSessionResources);
router.put('/resources/:resourceId', updateResource);
router.delete('/resources/:resourceId', deleteResource);

// Comment routes
router.post('/resources/:resourceId/comments', addResourceComment);
router.get('/resources/:resourceId/comments', getResourceComments);

export default router; 