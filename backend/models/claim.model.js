// Simulating in-memory storage for Claim data
const claims = [];

// Constructor for Claim class
class Claim {
    constructor(id, policyId, amount, status, filingDate) {
        this.id = id;
        this.policyId = policyId;
        this.amount = amount;
        this.status = status;
        this.filingDate = filingDate;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Static method to validate claim amount
    static validateAmount(claimAmount, policyAmount) {
        if (claimAmount <= 0) {
            return 'Claim amount must be greater than zero.';
        }
        if (claimAmount > policyAmount) {
            return `Claim amount cannot exceed the policy amount of ${policyAmount}.`;
        }
        return null;
    }

    // Instance method to update the remaining coverage on the associated policy
    updateRemainingCoverage() {
        const policy = Policy.findById(this.policyId);
        if (!policy) {
            throw new Error('Policy not found');
        }
        const amountValidation = Claim.validateAmount(this.amount, policy.remainingCoverageAmount);
        if (amountValidation) {
            throw new Error(amountValidation);
        }

        // Update remaining coverage in the associated policy
        policy.updateRemainingCoverage(this.amount);
    }

    // Save the claim to the "in-memory" array after validating
    static save(claim) {
        // Validate claim amount
        const policy = Policy.findById(claim.policyId);
        if (!policy) {
            throw new Error('Policy not found');
        }
        const amountValidation = Claim.validateAmount(claim.amount, policy.remainingCoverageAmount);
        if (amountValidation) {
            throw new Error(amountValidation);
        }

        // Validate claim status (Add status validation as needed)
        // const statusValidation = Claim.validateStatus(claim.status);
        // if (statusValidation) {
        //     throw new Error(statusValidation);
        // }

        // Save the claim
        claims.push(claim);
        claim.updateRemainingCoverage();  // This will internally call updateRemainingCoverage method in Policy model
    }

    // Static method to find a claim by ID
    static findById(id) {
        return claims.find(c => c.id === id);
    }
}

export default Claim;
