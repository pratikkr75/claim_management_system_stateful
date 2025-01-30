import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Policy from "./policy.model.js"; // Import the Policy model

const ClaimSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // UUID for claim ID
      unique: true,
    },
    policyId: {
      type: String,
      required: true,
      ref: 'Policy', // Reference to the Policy model
    },
    claimAmount: {
      type: Number,
      required: true,
      validate: {
        validator: function(amount) {
          return amount > 0;
        },
        message: "Claim amount must be greater than zero.",
      },
    },
    filingDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected'],
      message: 'Invalid status. Allowed values are: pending, approved, rejected.',
    },
  },
  { timestamps: true }
);

// Updated middleware to use UUID-based lookup
ClaimSchema.pre('save', async function(next) {
  try {
    // Use findOne with the UUID instead of findById
    const policy = await Policy.findOne({ id: this.policyId });
    
    if (!policy) {
      throw new Error("Associated policy not found.");
    }

    // Ensure we're working with numbers
    const claimAmount = Number(this.claimAmount);
    const remainingCoverage = Number(policy.remainingCoverageAmount);

    if (isNaN(claimAmount) || isNaN(remainingCoverage)) {
      throw new Error("Invalid claim amount or remaining coverage amount.");
    }
    
    if (policy.status !== 'active') {
      throw new Error("Policy is not active.");
    }

    // Check if the claim amount exceeds the remaining coverage
    if (this.claimAmount > policy.remainingCoverageAmount) {
      throw new Error("Claim amount exceeds remaining coverage amount.");
    }

    

    // Deduct the claim amount from the policy's remaining coverage
    policy.remainingCoverageAmount -= this.claimAmount;
    await policy.save();

    next();
  } catch (error) {
    next(error);
  }
});

const Claim = mongoose.model("Claim", ClaimSchema);
export default Claim;
