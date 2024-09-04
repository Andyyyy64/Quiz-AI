import { Request, Response } from 'express';
import bcypt from 'bcrypt';
import db from '../database/database';
import dotenv from 'dotenv';
import validator from 'validator';
import nodemailer from 'nodemailer';

import UserType from "../type/userType";

dotenv.config();
const saltRounds = 10;

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // 認証コードの生成
    const verificationCode: number = Math.floor(100000 + Math.random() * 900000);

    // パスワードのハッシュ化
    const hashedPassword: string = await bcypt.hash(password, saltRounds);

    try {
        // メールアドレスのバリデーションcheck
      if (!validator.isEmail(email)) {
        console.log("Invalid email" + " " + email);
        return res.status(400).json({ message: "無効なメールアドレスです" });
      }

      // ユーザーが既に存在するかどうかの確認
      const isUserExist: UserType = await db.get(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      // 存在する場合はエラーを返す
      if (isUserExist) {
        console.log("User already exists" + " " + email);
        return res.status(400).json({ message: "ユーザーは既に存在しています" });
      }

      try {
        // ユーザーをdbに挿入
        await db.run(
          "INSERT INTO users (name, email, password, verification_code, last_login) VALUES ($1, $2, $3, $4, $5)",
          [name, email, hashedPassword, verificationCode, new Date()]
        );
      } catch (err) {
        console.error("Failed to register user:", err);
        return res.status(500).json({ message: "ユーザーの登録に失敗しました" });
      }

      // nodemailerを使って認証コードをユーザーに送信
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      // メールの送信
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "メールアドレス確認のための認証コードです",
        text: `認証コードは ${verificationCode} です。`,
      });

      // 登録したユーザーを取得
      const user: UserType = await db.get(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      
      // ユーザー情報を返す
      res
        .status(200)
        .json({ message: "User registered successfully", user: user });

        console.log(user);
    } catch (err) {
        console.error('Failed to register user:', err);
        return res.status(500).json({ message: "Failed to register user" });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user: UserType = await db.get(
        "SELECT * FROM users WHERE user_id = $1",
        [id]
      );

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      res.status(200).json({ user: user });
    } catch (err) {
      console.error("Failed to get user:", err);
      return res.status(500).json({ message: "Failed to get user" });
    }
}

export const getUserByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;

    try {
      const user: UserType = await db.get(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      res.status(200).json({ user: user });
    } catch (err) {
      console.error("Failed to get user:", err);
      return res.status(500).json({ message: "Failed to get user" });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    // 更新したいユーザーのIDを取得
    const { id } = req.params;
    // 更新したいユーザー情報を取得
    const { name, prof_image_url, points } = req.body;

    try {
      // 取得した情報を元に更新
      await db.run(
        "UPDATE users SET name = $1, prof_image_url = $2, points = $3 updated_at = $4 WHERE user_id = $5",
        [name, prof_image_url, points, new Date(), id]
      );

      const user: UserType = await db.get(
        "SELECT * FROM users WHERE user_id = $1",
        [id]
      );

      res.status(200).json({ message: "User updated", user: user });
    } catch (err) {
      console.error("Failed to update user:", err);
      return res.status(500).json({ message: "Failed to update user" });
    }
} 

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await db.run("DELETE FROM users WHERE user_id = $1", [id]);
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      console.error("Failed to delete user:", err);
      return res.status(500).json({ message: "Failed to delete user" });
    }
}