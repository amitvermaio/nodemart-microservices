import mongoose from "mongoose";

const addressesSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ["user", "seller"], default: "user" },
  addresses: [addressesSchema],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;