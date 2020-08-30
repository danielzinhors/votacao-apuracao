import express from 'express';
import cors from 'cors';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import voteRouter from './routes/VoteRouter.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/api', (_, res) => {
  res.json({
    message:
      'Bem-vindo ao módulo de votação!' +
      'Acesse /votes para visualizar a votação em tempo real.',
  });
});

app.use('/api/vote', voteRouter);
const APP_PORT = process.env.PORT || 8080;
app.listen(APP_PORT, () => {
  console.log('Start');
});
