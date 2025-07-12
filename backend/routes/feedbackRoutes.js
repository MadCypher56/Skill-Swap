import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, submitFeedback);

export default router;
