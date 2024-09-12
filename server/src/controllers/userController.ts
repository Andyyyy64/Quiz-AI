import { Request, Response } from 'express';
import bcypt from 'bcrypt';
import db from '../database/database';
import dotenv from 'dotenv';
import validator from 'validator';
import nodemailer from 'nodemailer';

import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import path from 'path';

import UserType from "../type/userType";

dotenv.config();
const saltRounds = 10;

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
});

const bucket = storage.bucket(String(process.env.GCP_BUCKET_NAME));

// Request 型に file プロパティを追加するための型定義
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

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
  const { name, prof_image_url } = req.body;

  try {
    // 取得した情報を元に更新
    await db.run(
      "UPDATE users SET name = $1, prof_image_url = $2, updated_at = $3 WHERE user_id = $4",
      [name, prof_image_url, new Date(), id]
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

// GCPに画像をアップロードするAPI
export const uploadImage = async (req: MulterRequest, res: Response) => {
  console.log("ファイル情報:", req.file);  // ファイル情報をログ出力
  if (!req.file) {
    return res.status(400).json({ message: "ファイルがありません" });
  }

  const file = req.file;
  const blob = bucket.file(`${Date.now()}_${file.originalname}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on('error', (err) => {
    console.error('Upload failed:', err);
    return res.status(500).json({ message: 'アップロードに失敗しました' });
  });

  blobStream.on('finish', async () => {
    // GCP上のファイルの公開URLを取得
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    try {
      // ファイルを公開する (オプション)
      //await blob.makePublic();
      res.status(200).json({ message: 'ファイルが正常にアップロードされました', url: publicUrl });
    } catch (err) {
      console.error('Failed to make file public:', err);
      res.status(500).json({ message: 'ファイルの公開に失敗しましたが、アップロードは成功しました', url: publicUrl });
    }
  });

  blobStream.end(file.buffer);
};

export const saveAnsweredQuiz = async (req: Request, res: Response) => {
  const { user_id, quiz, user_choices, is_correct } = req.body;
  const choicesJson = JSON.stringify(quiz.choices)
  try {
    const result: any = await db.run(
      "INSERT INTO user_quiz_history (user_id, question, correct_answer, choices, category, subcategory, difficulty, explanation, user_choices, is_correct, answered_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING quiz_id",
      [user_id, quiz.question, quiz.correct_answer, choicesJson, quiz.category, quiz.subcategory, quiz.difficulty, quiz.explanation, user_choices, is_correct, new Date()],
      true
    );
    if (result && result.rows.length > 0) {
      const quiz_id = result.rows[0].quiz_id;
      res.status(200).json({ message: "Answer saved", quizID: quiz_id });
    } else {
      throw new Error("Failed to retrieve quiz_id");
    }
  } catch (err) {
    console.error("Failed to save answer:", err);
    return res.status(500).json({ message: "Failed to save answer" });
  }
}