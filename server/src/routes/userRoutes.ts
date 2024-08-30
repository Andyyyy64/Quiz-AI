import express, { Request, Response } from "express";
import {
    registerUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/middleware";
import { JwtPayload } from "jsonwebtoken";

// Request型を拡張してdecodedプロパティを追加
interface DecodedRequest extends Request {
    decoded?: string | JwtPayload | undefined;
}

const userRouter: express.Router = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/:id", authMiddleware, getUserById);
userRouter.put("/:id", authMiddleware, updateUser);
userRouter.delete("/:id", authMiddleware, deleteUser);

// ログインユーザーの情報を取得
userRouter.get("/me", authMiddleware, (req: DecodedRequest, res: Response) => {
  res.status(200).json({ user: req.decoded });
});

export default userRouter;