import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: express.Express = express();
const POST = Number(process.env.PORT) || 5000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(POST, () => {
    console.log(`Server is running on http://localhost:${POST}`);
})
