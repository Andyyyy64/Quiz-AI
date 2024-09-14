import express from 'express';
import { GenerateQuiz } from '../controllers/quizController';

import { authMiddleware } from '../middleware/middleware';

const quizRouter: express.Router = express.Router();

quizRouter.post('/generate', authMiddleware, GenerateQuiz);

export default quizRouter;