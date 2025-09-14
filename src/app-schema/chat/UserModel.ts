import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface User {
    id?: string;
    key?: string;
    fullName: string;
    email: string;
    password: string;
    isAdmin?: boolean;
    loginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface JwtUser extends JwtPayload {
    // Add properties that are specific to the custom user model
    user?: User
}

export const toUser = (newUser: any): User => {
    return {
        ...newUser,
        id: newUser._id.toString(),
    };
};

const userModelSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true, // usually email should be unique
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    loginAt: {
        type: Date,
    },
});

// Attach timestamps automatically
// This adds `createdAt` and `updatedAt`
userModelSchema.set("timestamps", true);

export const UserModel = mongoose.model("UserModel", userModelSchema);