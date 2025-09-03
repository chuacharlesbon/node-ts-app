import mongoose from "mongoose";

const myModelSchema = new mongoose.Schema({
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
  mobileNo: {
    type: String,
    required: [true, "Mobile Number is required"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  modelData: [
    {
      remarks: {
        type: String,
      },
      createdOn: {
        type: Date,
        default: Date.now, // standard way
      },
    },
  ],
});

// Attach timestamps automatically
// This adds `createdAt` and `updatedAt`
myModelSchema.set("timestamps", true);

export const MyModel = mongoose.model("MyModel", myModelSchema);