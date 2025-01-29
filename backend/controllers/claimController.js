import Claim from '../models/claim.model.js';
import Policy from '../models/policy.model.js';

// Controller for handling claims
class ClaimController {
    // Method to create a new claim
    static async createClaim(req, res) {
        const { id, policyId, amount, status, filingDate } = req.body;

        try {
            // Creating a new claim
            const claim = new Claim(id, policyId, amount, status, filingDate);

            // Validate claim amount against the policy's remaining coverage
            const policy = Policy.findById(policyId);
            if (!policy) {
                return res.status(404).json({ error: 'Policy not found' });
            }

            const amountValidation = Claim.validateAmount(amount, policy.remainingCoverageAmount);
            if (amountValidation) {
                return res.status(400).json({ error: amountValidation });
            }

            // Save claim and update the policy's remaining coverage
            Claim.save(claim);

            return res.status(201).json({ message: 'Claim created successfully', claim });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Method to get a claim by ID
    static getClaimById(req, res) {
        const claim = Claim.findById(req.params.id);
        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }
        return res.status(200).json(claim);
    }
}

export default ClaimController;
