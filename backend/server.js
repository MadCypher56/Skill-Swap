import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { performanceMiddleware, requestLogger } from './middleware/performanceMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import swapRoutes from './routes/swapRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import skillPostRoutes from './routes/skillPostRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Performance monitoring middleware
app.use(performanceMiddleware);
app.use(requestLogger);

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/swap', swapRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/skill-posts', skillPostRoutes);
app.use('/learning', learningRoutes);
app.use('/certifications', certificationRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Skill Swap API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Performance monitoring enabled`);
});
