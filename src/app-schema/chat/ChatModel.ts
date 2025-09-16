import mongoose from "mongoose";

const chatModelSchema = new mongoose.Schema({
    sender: {
        fullName: {
            type: String,
            required: [true, "Full Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
        },
    },
    receiver: {
        fullName: {
            type: String,
            required: [true, "Full Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
        },
    },
    threadKey: {
        type: [String],
        required: [true, "Thread key is required"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
    },
});

// Attach timestamps automatically
// This adds `createdAt` and `updatedAt`
chatModelSchema.set("timestamps", true);
chatModelSchema.index({ threadKey: 1 });

export const ChatModel = mongoose.model("ChatModel", chatModelSchema);