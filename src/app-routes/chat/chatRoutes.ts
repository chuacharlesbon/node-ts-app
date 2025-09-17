import express from 'express';
import { verify } from '../../utils/authJwt';
import { addChatCtrl, getChatsCtrl, getLatestChatCtrl } from '../../app-controllers/chat/chatController';

const chatThreadRouter = express.Router();

chatThreadRouter.post('/create-chat', verify, addChatCtrl);
chatThreadRouter.get('/chats/:id', verify, getChatsCtrl);
chatThreadRouter.get('/chats/latest/:id', verify, getLatestChatCtrl);

export default chatThreadRouter;