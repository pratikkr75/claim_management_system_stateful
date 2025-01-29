import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique ID generation
import Policy from './policy.model.js'; // Ensure you import the policy model

const claims = [];

class Claim {
    constructor(policyId, amount, status, filingDate) {
        this.id = uuidv4(); // Generate a unique ID using UUID
        this.policyId = policyId;
        this.amount = amount;
        this.status = status;
        this.filingDate = filingDate;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static validateAmount(claimAmount, policyAmount) {
        if (claimAmount <= 0) {
            return 'Claim amount must be greater than zero.';
        }
        if (claimAmount > policyAmount) {
            return `Claim amount cannot exceed the policy amount of ${policyAmount}.`;
        }
        return null;
    }

    updateRemainingCoverage() {
        const policy = Policy.findById(this.policyId);
        if (!policy) {
            throw new Error('Policy not found');
        }
        const amountValidation = Claim.validateAmount(this.amount, policy.remainingCoverageAmount);
        if (amountValidation) {
            throw new Error(amountValidation);
        }

        policy.updateRemainingCoverage(this.amount); // Update policy's remaining coverage
    }

    static save(claim) {
        const policy = Policy.findById(claim.policyId);
        if (!policy) {
            throw new Error('Policy not found');
        }
        const amountValidation = Claim.validateAmount(claim.amount, policy.remainingCoverageAmount);
        if (amountValidation) {
            throw new Error(amountValidation);
        }

        claims.push(claim);
        claim.updateRemainingCoverage(); // Update remaining coverage in policy
    }

    static findById(id) {
        return claims.find(c => c.id === id);
    }

    static updateClaim(id, updatedData) {
        const claim = claims.find(c => c.id === id);
        if (!claim) return null;

        Object.assign(claim, updatedData);
        claim.updatedAt = new Date();
        return claim;
    }

    static deleteClaim(id) {
        const index = claims.findIndex(c => c.id === id);
        if (index === -1) return false;
        claims.splice(index, 1);
        return true;
    }
}

export default Claim;
