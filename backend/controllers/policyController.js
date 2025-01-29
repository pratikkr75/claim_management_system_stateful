import { v4 as uuidv4 } from 'uuid'; // Import the UUID package

import Policy from '../models/policy.model.js';

// Controller for handling policies
class PolicyController {
    // Method to create a new policy
    static async createPolicy(req, res) {
        const { policyholderId, policyAmount, status, startDate } = req.body;

        try {
            const policyId = uuidv4(); // Generate a unique policy ID
            const policy = new Policy(policyId, policyholderId, policyAmount, status, startDate);

            // Validate the policy data and save the policy
            const amountValidation = Policy.validateAmount(policyAmount, policyAmount);
            if (amountValidation) {
                return res.status(400).json({ error: amountValidation });
            }

            const statusValidation = Policy.validateStatus(status);
            if (statusValidation) {
                return res.status(400).json({ error: statusValidation });
            }

            // Save the policy
            Policy.save(policy);

            return res.status(201).json({ message: 'Policy created successfully', policy });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Method to get a policy by ID
    static getPolicyById(req, res) {
        const policy = Policy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ error: 'Policy not found' });
        }
        return res.status(200).json(policy);
    }

    // Method to update the remaining coverage of a policy (PATCH)
    static updateCoverage(req, res) {
        const { claimAmount } = req.body;
        const policy = Policy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ error: 'Policy not found' });
        }

        try {
            // Update the remaining coverage after a claim
            policy.updateRemainingCoverage(claimAmount);
            return res.status(200).json({ message: 'Coverage updated successfully', policy });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Method to update a policy by ID
    // Method to update a policy by ID (PUT)
    static updatePolicy(req, res) {
        const { status, policyAmount } = req.body;
        const policy = Policy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ error: 'Policy not found' });
        }

        // Validate status
        const statusValidation = Policy.validateStatus(status);
        if (statusValidation) {
            return res.status(400).json({ error: statusValidation });
        }

        // Check if policyAmount is being updated and update remainingCoverageAmount
        if (policyAmount && policyAmount !== policy.policyAmount) {
            policy.policyAmount = policyAmount;
            policy.remainingCoverageAmount = policyAmount; // Ensure remaining coverage matches updated policyAmount
        }

        // Update the policy
        const updatedPolicy = Policy.updatePolicy(req.params.id, { status, policyAmount });
        if (!updatedPolicy) {
            return res.status(400).json({ error: 'Failed to update policy' });
        }

        return res.status(200).json(updatedPolicy);
    }


    // Method to delete a policy by ID
    static deletePolicy(req, res) {
        const success = Policy.deleteById(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Policy not found' });
        }
        return res.status(204).send();
    }
}

export default PolicyController;
