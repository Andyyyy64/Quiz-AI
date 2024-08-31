import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';

dotenv.config();

const app: express.Express = express();
const POST = Number(process.env.PORT) || 5000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/auth', authRouter);

app.listen(POST, () => {
    console.log(`Server is running on http://localhost:${POST}`);
})
