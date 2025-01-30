import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PolicyholderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // Use UUID for id
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
        message: "Invalid email format.",
      },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Policyholder = mongoose.model("Policyholder", PolicyholderSchema);
export default Policyholder;
