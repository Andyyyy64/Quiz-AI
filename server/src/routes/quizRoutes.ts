import express from 'express';
import { GenerateQuiz, saveQuiz } from '../controllers/quizController';

import { authMiddleware } from '../middleware/middleware';

const quizRouter: express.Router = express.Router();

quizRouter.post('/generate', authMiddleware, GenerateQuiz);
quizRouter.post('/save', authMiddleware, saveQuiz);

export default quizRouter;