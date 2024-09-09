import express from "express";
import {
    getSinglePlayHistory,
    getMultiPlayHistory,
    saveMultiPlayHistory,
    saveMultiPlayQuizHistory,
    saveSinglePlayHistory,
    saveSinglePlayQuizHistory,
    getMultiPlayQuizHistory,
    getSinglePlayQuizHistory
} from "../controllers/historyController";
import { authMiddleware } from "../middleware/middleware";

const historyRouter: express.Router = express.Router();

historyRouter.get("/singleplay/:user_id", authMiddleware, getSinglePlayHistory);
historyRouter.get("/multiplay/:user_id", authMiddleware, getMultiPlayHistory);
historyRouter.post("/singleplay", authMiddleware, saveSinglePlayHistory);
historyRouter.post("/singleplayquiz", authMiddleware, saveSinglePlayQuizHistory);
historyRouter.post("/multiplay", authMiddleware, saveMultiPlayHistory);
historyRouter.post("/multiplayquiz", authMiddleware, saveMultiPlayQuizHistory);
historyRouter.get("/singleplayquiz/:singleplay_id", authMiddleware, getSinglePlayQuizHistory);
historyRouter.get("/multiplayquiz/:session_id", authMiddleware, getMultiPlayQuizHistory);

export default historyRouter;