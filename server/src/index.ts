import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';

import { setupWebSocketServer } from './ws/setupWebScoketServer';

dotenv.config();

const app: express.Express = express();
const POST = Number(process.env.PORT) || 5000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/auth', authRouter);

const server = http.createServer(app);
setupWebSocketServer(server);

server.listen(POST, () => {
    console.log(`Server is running on http://localhost:${POST}`);
})
