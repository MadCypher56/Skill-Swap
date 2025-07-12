import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  createCertification,
  getUserCertifications,
  getSessionCertifications,
  updateCertification,
  deleteCertification,
  getSwapRequestCertifications
} from '../controllers/certificationController.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Certification routes
router.post('/certifications', createCertification);
router.get('/certifications/user', getUserCertifications);
router.get('/certifications/session/:sessionId', getSessionCertifications);
router.put('/certifications/:certificationId', updateCertification);
router.delete('/certifications/:certificationId', deleteCertification);
router.get('/certifications/swap/:swapRequestId', getSwapRequestCertifications);

export default router; 