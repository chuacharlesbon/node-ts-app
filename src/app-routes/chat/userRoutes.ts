import express from 'express';
import { getAllUsersCtrl, getProfileCtrl, loginCtrl, registerCtrl } from '../../app-controllers/chat/userController';
import { verify } from '../../utils/authJwt';

const chatUserRouter = express.Router();

chatUserRouter.post('/register', registerCtrl);
chatUserRouter.post('/login', loginCtrl);
chatUserRouter.get('/users', verify, getAllUsersCtrl);
chatUserRouter.get('/user-profile', verify, getProfileCtrl);

export default chatUserRouter;