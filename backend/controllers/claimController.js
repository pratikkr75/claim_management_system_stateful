import Claim from '../models/claim.model.js';
import Policy from '../models/policy.model.js';

class ClaimController {
    static async createClaim(req, res) {
        const { policyId, amount, status, filingDate } = req.body;

        try {
            const claim = new Claim(policyId, amount, status, filingDate);

            const policy = Policy.findById(policyId);
            if (!policy) {
                return res.status(404).json({ error: 'Policy not found' });
            }

            const amountValidation = Claim.validateAmount(amount, policy.remainingCoverageAmount);
            if (amountValidation) {
                return res.status(400).json({ error: amountValidation });
            }

            Claim.save(claim);
            return res.status(201).json({ message: 'Claim created successfully', claim });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static getClaimById(req, res) {
        const claim = Claim.findById(req.params.id);
        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }
        return res.status(200).json(claim);
    }

    static updateClaim(req, res) {
        const { amount, status } = req.body;
        const claim = Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }

        const updatedClaim = Claim.updateClaim(req.params.id, { amount, status });
        if (!updatedClaim) {
            return res.status(400).json({ error: 'Failed to update claim' });
        }

        return res.status(200).json(updatedClaim);
    }

    static deleteClaim(req, res) {
        const success = Claim.deleteClaim(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Claim not found' });
        }
        return res.status(204).send();
    }
}

export default ClaimController;
