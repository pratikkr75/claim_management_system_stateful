import Claim from "../models/claim.model.js";
import Policy from "../models/policy.model.js";

class ClaimController {
    // Create a new claim
    async createClaim(req, res) {
        try {
            const { policyId, claimAmount, filingDate, status } = req.body;

            // Validate required fields
            if (!policyId || !claimAmount || !status || !filingDate) {
                console.log("2. Validation failed - missing fields");

                return res.status(400).json({ error: "All fields are required." });
            }
            
            // // Ensure that the policy exists using aggregate for UUIDs
            // const policy = await Policy.aggregate([
            //     { $match: { id: policyId } }, // Match the policy based on UUID
            //     {
            //         $lookup: {
            //             from: 'policies', // The name of the Policy collection in lowercase
            //             localField: 'id',
            //             foreignField: 'id', // Assuming the `id` field in the `Policy` collection is a UUID
            //             as: 'policy' // The resulting array of populated documents
            //         }
            //     },
            //     { $unwind: '$policy' } // Unwrap the array into a single object
                
            // ]);
            // console.log("7. Aggregate lookup result:", JSON.stringify(policy, null, 2));
                 // Check if policy exists first
            const policy = await Policy.findOne({ id: policyId });
            
            if (!policy) {
                return res.status(400).json({ error: "Invalid policy ID." });
            }

                if (policy.length === 0) {
                    return res.status(400).json({ error: "Invalid policy ID." });
                }

       
            // Create and save the new claim
            const newClaim = await Claim.create({
                policyId,
                claimAmount,
                status,
                filingDate
            });
            

            return res.status(201).json({
                message: "Claim created successfully",
                claim: {
                    id: newClaim.id,
                    policyId: newClaim.policyId,
                    claimAmount: newClaim.claimAmount,
                    status: newClaim.status,
                    filingDate: newClaim.filingDate,
                    createdAt: newClaim.createdAt,
                    updatedAt: newClaim.updatedAt
                }
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }


    // Get a claim by ID
    async getClaimById(req, res) {
        try {
            const claim = await Claim.aggregate([
                { $match: { id: req.params.id } },
                {
                    $lookup: {
                        from: 'policies', // The name of the Policy collection in lowercase
                        localField: 'policyId',
                        foreignField: 'id',
                        as: 'policy' // The resulting array of populated documents
                    }
                },
                { $unwind: '$policy' } // Unwrap the array into a single object
            ]);

            if (claim.length === 0) {
                return res.status(404).json({ error: "Claim not found" });
            }

            return res.status(200).json({
                message: "Claim retrieved successfully",
                claim: claim[0] // Return the populated claim object
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Update claim status
    async updateClaim(req, res) {
        try {
            const { amount, status } = req.body;
            
            // First get the existing claim
            const existingClaim = await Claim.findOne({ id: req.params.id });
            
            if (!existingClaim) {
                return res.status(404).json({ error: "Claim not found" });
            }

            // Get associated policy
            const policy = await Policy.findOne({ id: existingClaim.policyId });
            
            if (!policy) {
                return res.status(404).json({ error: "Associated policy not found" });
            }

            // Handle amount update for approved claims
            if (amount && existingClaim.status === 'approved') {
                // First, restore the old claim amount
                policy.remainingCoverageAmount += existingClaim.claimAmount;
                
                // Then check if new amount is valid
                if (amount > policy.remainingCoverageAmount) {
                    return res.status(400).json({ 
                        error: "New claim amount exceeds available coverage",
                        availableCoverage: policy.remainingCoverageAmount,
                        requestedAmount: amount
                    });
                }
                
                // Deduct new amount
                policy.remainingCoverageAmount -= amount;
                await policy.save();
            }

            // Handle status changes
            if (status) {
                const claimAmount = amount || existingClaim.claimAmount;

                // If changing to approved
                if (status === 'approved' && existingClaim.status !== 'approved') {
                    if (claimAmount > policy.remainingCoverageAmount) {
                        return res.status(400).json({ 
                            error: "Claim amount exceeds remaining coverage",
                            availableCoverage: policy.remainingCoverageAmount,
                            requestedAmount: claimAmount
                        });
                    }
                    policy.remainingCoverageAmount -= claimAmount;
                }
                
                // If changing from approved to another status
                if (existingClaim.status === 'approved' && status !== 'approved') {
                    policy.remainingCoverageAmount += existingClaim.claimAmount;
                }

                await policy.save();
            }

            // Update claim
            const updateData = {};
            if (amount !== undefined) updateData.claimAmount = amount;
            if (status !== undefined) updateData.status = status;

            const updatedClaim = await Claim.findOneAndUpdate(
                { id: req.params.id },
                updateData,
                { new: true }
            );

            // Get updated claim with policy details
            const populatedClaim = await Claim.aggregate([
                { $match: { id: req.params.id } },
                {
                    $lookup: {
                        from: 'policies',
                        localField: 'policyId',
                        foreignField: 'id',
                        as: 'policy'
                    }
                },
                { $unwind: '$policy' }
            ]);

            return res.status(200).json({
                message: "Claim updated successfully",
                claim: populatedClaim[0],
                policyRemainingCoverage: policy.remainingCoverageAmount
            });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Delete claim
    async deleteClaim(req, res) {
        try {
            // Use aggregate to find the claim by its id before deleting
            const claim = await Claim.aggregate([
                { $match: { id: req.params.id } },
                {
                    $lookup: {
                        from: 'policies',
                        localField: 'policyId',
                        foreignField: 'id',
                        as: 'policy'
                    }
                },
                { $unwind: '$policy' }
            ]);

            if (claim.length === 0) {
                return res.status(404).json({ error: "Claim not found" });
            }

            // Delete the claim
            await Claim.findOneAndDelete({ id: req.params.id });

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

const claimController = new ClaimController();
export default claimController;
