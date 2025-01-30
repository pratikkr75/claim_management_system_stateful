import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Policyholder from "./policyholder.model.js"; // Import the Policyholder model

const PolicySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // UUID for policy ID
      unique: true,
    },
    policyholderId: {
      type: String,
      required: true,
      ref: 'Policyholder', // Reference to the Policyholder model
    },
    policyAmount: {
      type: Number,
      required: true,
      validate: {
        validator: (amount) => amount > 0,
        message: "Amount must be greater than zero.",
      },
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'expired', 'cancelled'],
      message: 'Invalid status. Allowed values are: active, expired, cancelled.',
    },
    startDate: {
      type: Date,
      required: true,
    },
    remainingCoverageAmount: {
      type: Number
    },
  },
  { timestamps: true }
);

// // Pre-save middleware to set initial remaining coverage
// PolicySchema.pre('findOne', function (next) {
//   this.populate({
//     path: 'policyholderId',
//     model: 'Policyholder',
//     match: { id: this.policyholderId }, // Explicit UUID match
//   });
//   next();
// });


// // Populate the Policyholder details when getting the policy
// PolicySchema.pre('findOne', function(next) {
//     this.populate('policyholderId');
//     next();
// });
// Pre-save middleware to set initial remaining coverage
PolicySchema.pre('save', function(next) {
  if (this.isNew) {
    this.remainingCoverageAmount = Number(this.policyAmount);
  }
  next();
});

// Pre-validate middleware to ensure remainingCoverageAmount is valid
PolicySchema.pre('validate', function(next) {
  if (this.remainingCoverageAmount === undefined || isNaN(this.remainingCoverageAmount)) {
    this.remainingCoverageAmount = Number(this.policyAmount);
  }
  next();
});

const Policy = mongoose.model("Policy", PolicySchema);
export default Policy;