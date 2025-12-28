import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmr-r4fEjb-i5BGvvssVeSpF9mEv3e4OhXeQ&s",
    },
  },
  { timestamps: true }
);

const User=mongoose.model('User',userSchema);

export default User;