import express from 'express';
import {
    saveSinglePlayHistory,
    saveMultiPlayHistory,
    getSinglePlayHistory,
    getMultiPlayHistory,
    getAllMultiPlayHistory,
    getAllSinglePlayHistory
} from '../controllers/playController';
import { authMiddleware } from '../middleware/middleware';

const playRoutes: express.Router = express.Router();

playRoutes.post('/singleplay', authMiddleware, saveSinglePlayHistory);
playRoutes.post('/multiplay', authMiddleware, saveMultiPlayHistory);
playRoutes.get('/singleplay/:id', authMiddleware, getSinglePlayHistory);
playRoutes.get('/multiplay/:session_id', authMiddleware, getMultiPlayHistory);
playRoutes.get('/singleplay', authMiddleware, getAllSinglePlayHistory);
playRoutes.get('/multiplay', authMiddleware, getAllMultiPlayHistory);

export default playRoutes;
