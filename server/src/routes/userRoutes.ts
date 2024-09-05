import express, { Request, Response } from "express";
import {
    registerUser,
    getUserById,
    updateUser,
    deleteUser,
    uploadImage
} from "../controllers/userController";
import { authMiddleware } from "../middleware/middleware";
import { JwtPayload } from "jsonwebtoken";
import multer from "multer";

// Request型を拡張してdecodedプロパティを追加
interface DecodedRequest extends Request {
    decoded?: string | JwtPayload | undefined;
}

// メモリにファイルを保存する設定
const upload = multer({
  storage: multer.memoryStorage(),
});

const userRouter: express.Router = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/get/:id", authMiddleware, getUserById);
userRouter.put("/put/:id", authMiddleware, updateUser);
userRouter.delete("/delete/:id", authMiddleware, deleteUser);
userRouter.post("/upload", authMiddleware, upload.single('file'), uploadImage);

// ログインユーザーの情報を取得
userRouter.get("/me", authMiddleware, (req: DecodedRequest, res: Response) => {
  res.status(200).json({ user: req.decoded });
});

export default userRouter;