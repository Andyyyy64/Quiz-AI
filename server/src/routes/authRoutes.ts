import express, { Request, Response } from "express";
import { login, verifyEmail } from "../controllers/authController";
import { authMiddleware } from "../middleware/middleware";
import { JwtPayload } from "jsonwebtoken";

const authRouter: express.Router = express.Router();

authRouter.post("/login", login);
authRouter.post("/verify", verifyEmail);

export default authRouter;