import { Request, Response } from "express";
import { print } from "../../helpers/chat/helpers";
import { ChatModel } from "../../app-schema/chat/ChatModel";
import { User } from "../../app-schema/chat/UserModel";

export const addChatCtrl = async (req: Request, res: Response): Promise<void> => {
    try {
        print("addChatCtrl");

        const { sender, receiver, message} = req.body;
        const newChat = new ChatModel({
            sender: sender,
            receiver: receiver,
            threadKey: [sender.email, receiver.email],
            message: message
        })

        const result = await newChat.save();

        res.status(200).json({
            message: "Chat created",
            data: result
        });
        return;
    } catch (e) {
        res.status(400).json({
            message: `Error: Something went wrong. ${e}`,
        });
        return;
    }
};

export const getChatsCtrl = async (req: Request, res: Response): Promise<void> => {
    try {
        print("getChatsCtrl");
        const user = req.user;
        if (!user) {
            res.status(400).json({
                message: "No user data.",
            });
            return;
        }else{
            const userList = await ChatModel.find({
                threadKey: user.user?.email
            });
            res.status(200).json({
                message: "Chat list",
                data: userList
            });
            return;
        }
    } catch (e) {
        res.status(400).json({
            message: `Error: Something went wrong. ${e}`,
        });
        return;
    }
};