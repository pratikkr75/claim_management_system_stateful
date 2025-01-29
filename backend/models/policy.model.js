// Simulating in-memory storage for Policy data
const policies = [];

// Constructor for Policy class
class Policy {
    constructor(id, policyholderId, policyAmount, status, startDate) {
        this.id = id;
        this.policyholderId = policyholderId;
        this.policyAmount = policyAmount;
        this.status = status;
        this.startDate = startDate;
        this.remainingCoverageAmount = policyAmount; // Tracks the available coverage
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Check if policy is active
    isPolicyActive() {
        return this.status === 'active';
    }

    // Static method to validate policy amount
    static validateAmount(amount, policyAmount) {
        if (amount <= 0) {
            return 'Amount must be greater than zero.';
        }
        if (amount > policyAmount) {
            return `Claim amount cannot exceed the policy amount of ${policyAmount}.`;
        }
        return null;
    }

    // Static method to validate policy status
    static validateStatus(status) {
        const validStatuses = ['active', 'expired', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return 'Invalid status. Allowed values are: active, expired, cancelled.';
        }
        return null;
    }

    // Save the policy to the "in-memory" array after validating
    static save(policy) {
        // Check if the policy already exists
        const existingPolicy = policies.find(p => p.id === policy.id);
        if (existingPolicy) {
            throw new Error('Policy with the same ID already exists.');
        }

        // Validate policy amount
        const amountValidation = Policy.validateAmount(policy.policyAmount, policy.policyAmount);
        if (amountValidation) {
            throw new Error(amountValidation);
        }

        // Validate policy status
        const statusValidation = Policy.validateStatus(policy.status);
        if (statusValidation) {
            throw new Error(statusValidation);
        }

        // If valid, save the policy
        policies.push(policy);
    }

    // Static method to find a policy by ID
    static findById(id) {
        return policies.find(p => p.id === id);
    }

    // Method to update the remaining coverage amount after a claim
    updateRemainingCoverage(claimAmount) {
        if (claimAmount > this.remainingCoverageAmount) {
            throw new Error('Claim amount exceeds remaining coverage.');
        }
        this.remainingCoverageAmount -= claimAmount;
        this.updatedAt = new Date();
    }

    // Static method to delete a policy by ID
    static deleteById(id) {
        const index = policies.findIndex(p => p.id === id);
        if (index === -1) return false;
        policies.splice(index, 1);
        return true;
    }

    // Static method to update policy details and remaining coverage amount
    static updatePolicy(id, updatedData) {
        const policy = policies.find(p => p.id === id);
        if (!policy) return null;

        // If the policyAmount is updated, update the remainingCoverageAmount as well
        if (updatedData.policyAmount && updatedData.policyAmount !== policy.policyAmount) {
            policy.policyAmount = updatedData.policyAmount;
            policy.remainingCoverageAmount = updatedData.policyAmount; // Ensure remaining coverage is updated
        }

        // If the status is updated, just update the status
        if (updatedData.status) {
            policy.status = updatedData.status;
        }

        policy.updatedAt = new Date();
        return policy;
    }
}

export default Policy;
