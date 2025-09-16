import express from 'express';
import { verify } from '../../utils/authJwt';
import { addChatCtrl, getChatsCtrl } from '../../app-controllers/chat/chatController';

const chatThreadRouter = express.Router();

chatThreadRouter.post('/create-chat', verify, addChatCtrl);
chatThreadRouter.get('/chats/:id', verify, getChatsCtrl);

export default chatThreadRouter;