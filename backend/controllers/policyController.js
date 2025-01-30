import Policy from "../models/policy.model.js";
import Policyholder from "../models/policyholder.model.js";

class PolicyController {
    // Create a new policy
    async createPolicy(req, res) {
        try {
            const { policyholderId, policyAmount, status, startDate } = req.body;

            // Validate required fields
            if (!policyholderId || !policyAmount || !status || !startDate) {
                return res.status(400).json({ error: "All fields are required." });
            }

            // Ensure that the policyholder exists
            const policyholder = await Policyholder.findOne({ id: policyholderId });
            if (!policyholder) {
                return res.status(400).json({ error: "Invalid policyholder ID." });
            }

            // Create and save the new policy
            const newPolicy = await Policy.create({
                policyholderId,
                policyAmount,
                status,
                startDate
            });

            return res.status(201).json({
                message: "Policy created successfully",
                policy: {
                    id: newPolicy.id,
                    policyholderId: newPolicy.policyholderId,
                    policyAmount: newPolicy.policyAmount,
                    status: newPolicy.status,
                    startDate: newPolicy.startDate,
                    remainingCoverageAmount: newPolicy.remainingCoverageAmount,
                    createdAt: newPolicy.createdAt,
                    updatedAt: newPolicy.updatedAt
                }
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // Get a policy by ID
    async getPolicyById(req, res) {
        try {
            const policy = await Policy.aggregate([
                { $match: { id: req.params.id } },
                {
                    $lookup: {
                        from: 'policyholders', // The name of the Policyholder collection in lowercase
                        localField: 'policyholderId',
                        foreignField: 'id', // Assuming the `id` field in the `Policyholder` collection is a UUID
                        as: 'policyholder' // The resulting array of populated documents
                    }
                },
                { $unwind: '$policyholder' } // If you want to unwrap the array into a single object
            ]);

            if (policy.length === 0) {
                return res.status(404).json({ error: "Policy not found" });
            }

            return res.status(200).json({
                message: "Policy retrieved successfully",
                policy: policy[0] // Since $unwind reduces the array to a single object
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Update policy coverage
    async updateCoverage(req, res) {
        try {
            const { claimAmount } = req.body;

            // Use aggregate to find the policy by its id
            const policy = await Policy.aggregate([
                { $match: { id: req.params.id } },
                {
                    $lookup: {
                        from: 'policyholders',
                        localField: 'policyholderId',
                        foreignField: 'id',
                        as: 'policyholder'
                    }
                },
                { $unwind: '$policyholder' }
            ]);

            if (policy.length === 0) {
                return res.status(404).json({ error: "Policy not found" });
            }

            const foundPolicy = policy[0];

            // Validate the claim amount
            if (claimAmount > foundPolicy.remainingCoverageAmount) {
                return res.status(400).json({ error: "Claim amount exceeds remaining coverage." });
            }

            foundPolicy.remainingCoverageAmount -= claimAmount;

            // Save the updated policy
            await Policy.findOneAndUpdate({ id: req.params.id }, { remainingCoverageAmount: foundPolicy.remainingCoverageAmount }, { new: true });

            return res.status(200).json(foundPolicy);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Update policy
    async updatePolicy(req, res) {
        try {
            const { status, policyAmount } = req.body;

            // Use aggregate to find the policy by its id
            const policy = await Policy.aggregate([
                { $match: { id: req.params.id } },
                {
                    $lookup: {
                        from: 'policyholders',
                        localField: 'policyholderId',
                        foreignField: 'id',
                        as: 'policyholder'
                    }
                },
                { $unwind: '$policyholder' }
            ]);

            if (policy.length === 0) {
                return res.status(404).json({ error: "Policy not found" });
            }

            const foundPolicy = policy[0];

            if (policyAmount) {
                foundPolicy.policyAmount = policyAmount;
                foundPolicy.remainingCoverageAmount = policyAmount;
            }

            if (status) {
                foundPolicy.status = status;
            }

            // Save the updated policy
            await Policy.findOneAndUpdate({ id: req.params.id }, foundPolicy, { new: true });

            return res.status(200).json(foundPolicy);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // Delete policy
    async deletePolicy(req, res) {
        try {
            // Use aggregate to find the policy by its id before deleting
            const policy = await Policy.aggregate([
                { $match: { id: req.params.id } },
                {
                    $lookup: {
                        from: 'policyholders',
                        localField: 'policyholderId',
                        foreignField: 'id',
                        as: 'policyholder'
                    }
                },
                { $unwind: '$policyholder' }
            ]);

            if (policy.length === 0) {
                return res.status(404).json({ error: "Policy not found" });
            }

            // Delete the policy
            await Policy.findOneAndDelete({ id: req.params.id });

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

const policyController = new PolicyController();
export default policyController;
