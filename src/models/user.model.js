import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  name: String,

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String
  },

  avatar: String,

  role: {
    type: String,
    default: "user"
  },

  isVerified: {
    type: Boolean,
    default: true
  }
},
{ timestamps: true }
);

export default mongoose.model("User", userSchema);