import express from 'express';
import { getAllUsersCtrl, loginCtrl, registerCtrl } from '../../app-controllers/chat/userController';
import { verify } from '../../utils/authJwt';

const chatUserRouter = express.Router();

chatUserRouter.post('/register', registerCtrl);
chatUserRouter.post('/login', loginCtrl);
chatUserRouter.get('/users', verify, getAllUsersCtrl);

export default chatUserRouter;