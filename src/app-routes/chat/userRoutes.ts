import express from 'express';
import { loginCtrl, registerCtrl } from '../../app-controllers/chat/userController';

const chatUserRouter = express.Router();

chatUserRouter.post('/register', registerCtrl);
chatUserRouter.post('/login', loginCtrl);

export default chatUserRouter;