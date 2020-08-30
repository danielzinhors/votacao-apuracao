import express from 'express';
import VoteController from '../controller/VoteController.js';

const voteRouter = express.Router();

voteRouter.get('/', VoteController.findAll);
voteRouter.post('/restart', VoteController.restart);

export default voteRouter;
