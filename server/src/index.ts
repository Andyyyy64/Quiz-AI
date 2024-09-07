import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import quizRouter from './routes/quizRoutes'
import playRoutes from './routes/playRoutes';

import { setupWebSocketServer } from './ws/setupWebScoketServer';

dotenv.config();

const app: express.Express = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/quiz', quizRouter);
app.use('/play', playRoutes);

const server = http.createServer(app);
setupWebSocketServer(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
