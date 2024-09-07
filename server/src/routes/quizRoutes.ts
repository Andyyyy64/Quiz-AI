import express from 'express';

import { generateQuiz } from '../controllers/quizController';

const quizRouter: express.Router = express.Router();

quizRouter.post('/generate', generateQuiz);

export default quizRouter;