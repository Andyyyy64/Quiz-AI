import express from 'express';
import { generateQuiz, saveQuiz, getQuiz, getQuizzes } from '../controllers/quizController';

import { authMiddleware } from '../middleware/middleware';

const quizRouter: express.Router = express.Router();

quizRouter.post('/generate', authMiddleware, generateQuiz);
quizRouter.post('/save', authMiddleware, saveQuiz);
quizRouter.get('/:id', authMiddleware, getQuiz);
quizRouter.get('/', authMiddleware, getQuizzes);

export default quizRouter;