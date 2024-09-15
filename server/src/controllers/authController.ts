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
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "無効なメールアドレスです" });
        }

        const user: UserType = await db.get(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        // ユーザーが存在しない場合はエラーを返す
        if (!user) {
            console.log("User not found" + " " + email);
            return res.status(400).json({ message: "ユーザーが見つかりません" });
        }

        // メールアドレスが認証されていない場合はエラーを返す
        /*
        if (!user.email_verified) {
            console.log("Email not verified" + " " + email);
            return res.status(400).json({ message: "メールアドレスが認証されていません" });
        }
        */

        // パスワードの照合
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            console.log("Password does not match" + " " + password);
            return res.status(400).json({ message: "パスワードが間違っています" });
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
        res.json({ message: "Login success", token: token, user: user });
    } catch (err) {
        console.error("Failed to login:", err);
        return res.status(500).json({ message: "ログインに失敗しました" });
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    const { email, verification_code } = req.body;
    console.log("verifyEmail" + " " + email + " " + verification_code);
    try {
        // emailとverification_codeが一致するユーザーを取得
        const user: UserType = await db.get(
            "SELECT * FROM users WHERE email = $1 AND verification_code = $2",
            [email, verification_code]
        );
        console.log("user" + " " + user);
        if (!user) {
            return res.status(400).json({ message: "ユーザーが見つかりません" });
        }

        // email_verifiedをtrueに更新
        await db.run("UPDATE users SET email_verified = true WHERE email = $1", [email]);
        res.status(200).json({ message: "Email verified" });
    } catch (err) {
        console.error("Failed to verify email:", err);
        res.status(500).json({ message: "メールアドレスの認証に失敗しました" });
    }
}