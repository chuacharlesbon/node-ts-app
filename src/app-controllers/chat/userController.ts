import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { toUser, UserModel } from "../../app-schema/chat/UserModel";
import { print } from "../../helpers/chat/helpers";
import { authGenerateUserToken } from "../../utils/authJwt";
import { DEV_MODE } from "../../config/config";

export const registerCtrl = async (req: Request, res: Response): Promise<void> => {
    try {
        print("registerCtrl");
        const { fullName, email, password, isAdmin } = req.body;
        const hashedPW = bcrypt.hashSync(password, 10);

        const newUser = new UserModel({
            fullName: fullName,
            email: email,
            password: hashedPW,
            isAdmin: isAdmin
        })

        const result = await newUser.save();
        res.status(200).json({
            data: result,
            message: "New user created",
        });
        return;
    } catch (e) {
        res.status(400).json({
            message: `Error: Something went wrong. ${e}`,
        });
        return;
    }
};

export const loginCtrl = async (req: Request, res: Response): Promise<void> => {
    try {
        print("loginCtrl");
        const { email, password } = req.body;

        const currentUser = await UserModel.findOne({ email: req.body.email });

        if (currentUser) {
            const isPasswordCorrect = bcrypt.compareSync(password, currentUser.password);

            if (isPasswordCorrect) {
                const user = await UserModel.findOneAndUpdate(
                    { email },
                    { loginAt: new Date() },
                    { new: true, projection: { password: 0 } } // 0 means exclude
                );

                const newUser = toUser(user?.toObject());
                newUser.key = "access";

                // Set cookie
                const accessToken = authGenerateUserToken(newUser); // 12 hours default
                newUser.key = "refresh";
                const refreshToken = authGenerateUserToken(newUser, 604800); // 7 days

                res.cookie('access_token', `Bearer ${accessToken}`, {
                    httpOnly: true,
                    secure: !DEV_MODE,
                    sameSite: !DEV_MODE ? 'none' : 'lax',
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                });
                res.cookie('refresh_token', `Bearer ${refreshToken}`, {
                    httpOnly: true,
                    secure: !DEV_MODE,
                    sameSite: !DEV_MODE ? 'none' : 'lax',
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                });

                res.status(200).json({
                    data: user,
                    message: "Logged in successfully.",
                });
                return;
            } else {
                res.status(400).json({
                    message: `Error: Invalid login.`,
                });
                return;
            }
        } else {
            res.status(400).json({
                message: `Error: Cannot find user.`,
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

export const getAllUsersCtrl = async (req: Request, res: Response): Promise<void> => {
    try {
        print("getAllUsersCtrl");
        const userList = await UserModel.find();
        res.status(200).json({
            message: "User List",
            data: userList
        });
        return;
    } catch (e) {
        res.status(400).json({
            message: `Error: Something went wrong. ${e}`,
        });
        return;
    }
};

export const getProfileCtrl = async (req: Request, res: Response): Promise<void> => {
    try {
        print("getProfileCtrl");
        const user = req.user;

        if (!user) {
            res.status(400).json({
                message: `Error: Cannot find user.`,
            });
            return;
        } else {
            const currentUser = await UserModel.findOne({ email: user.user?.email ?? "N/A" });
            if (!currentUser) {
                res.status(400).json({
                    message: `Error: Cannot find user.`,
                });
                return;
            } else {
                const newUser = toUser(currentUser?.toObject());
                res.status(200).json({
                    data: newUser,
                    message: "User Profile",
                });
                return;
            }
        }
    } catch (e) {
        res.status(400).json({
            message: `Error: Something went wrong. ${e}`,
        });
        return;
    }
};