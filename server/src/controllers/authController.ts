import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import validator from "validator";
import db from "../database/database";
import UserType from "../type/userType";

dotenv.config();

const secretKey = process.env.JWT_SECRET ?? "unko";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        // メールアドレスのバリデーションcheck
        if(!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const user: UserType = await db.get(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        // ユーザーが存在しない場合はエラーを返す
        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // メールアドレスが認証されていない場合はエラーを返す
        if(!user.email_verified) {
            return res.status(400).json({ message: "Email not verified" });
        }

        // パスワードの照合
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // jwtの生成
        const token: string = jwt.sign(
          {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            points: user.points,
            rank: user.rank,
            prof_image_url: user.prof_image_url,
            last_login: user.last_login,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
          secretKey,
          { expiresIn: "1w" } // 期限は1週間
        );
        console.log("login success" + user.email + " " + token);
        res.json({ message: "Login success", token: token });
    } catch (err) {
        console.error("Failed to login:", err);
        return res.status(500).json({ message: "Failed to login" });
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    const { email, verification_code } = req.body;

    try {
        // emailとverification_codeが一致するユーザーを取得
        const user: UserType = await db.get(
            "SELECT * FROM users WHERE email = $1 AND verification_code = $2",
            [email, verification_code]
        );
        console.log(user);
        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // email_verifiedをtrueに更新
        await db.run("UPDATE users SET email_verified = true WHERE email = $1", [email]);
        res.send("Email verified");
    } catch(err) {
        console.error("Failed to verify email:", err);
        res.status(500).json({ message: "Failed to verify email" });
    }
}