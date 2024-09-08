import express from 'express';
import { GenerateQuizzes, GenerateQuiz, saveQuiz, getQuiz, getQuizzes, GenerateQuizzesOneStep } from '../controllers/quizController';

import { authMiddleware } from '../middleware/middleware';

const quizRouter: express.Router = express.Router();

quizRouter.post('/generate', authMiddleware, GenerateQuiz);
quizRouter.post('/save', authMiddleware, saveQuiz);
quizRouter.get('/:id', authMiddleware, getQuiz);
quizRouter.get('/', authMiddleware, getQuizzes);
quizRouter.post('/generateQuizzes', authMiddleware, GenerateQuizzes);
quizRouter.post('/generateQuizzesOneStep', authMiddleware, GenerateQuizzesOneStep);

export default quizRouter;