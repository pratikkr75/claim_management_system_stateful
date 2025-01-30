// validationMiddleware.js

// Import required libraries for validation using ES modules
import { body, validationResult } from 'express-validator';

class ValidationMiddleware {

  // Validate claim creation
  static async validateClaimCreate(req, res, next) {
    // Define validation rules for claims
    const validations = [
      body('amount').isDecimal().withMessage('Amount should be a valid decimal'),
      body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Status should be one of pending, approved, or rejected'),
      body('policyId').notEmpty().withMessage('Policy ID is required'),
      body('filingDate').isDate().withMessage('Filing date should be a valid date')
    ];

    // Run validation checks
    try {
      await Promise.all(validations.map(validation => validation.run(req)));
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'Validation failed' });
    }
  }

  // Validate policy creation
  static async validatePolicyCreate(req, res, next) {
    // Define validation rules for policies
    const validations = [
      body('policyAmount').isDecimal().withMessage('Policy amount should be a valid decimal'),
      body('remainingCoverageAmount').isDecimal().withMessage('Remaining coverage should be a valid decimal'),
      body('status').isIn(['active', 'expired', 'cancelled']).withMessage('Status should be one of active, expired, or cancelled'),
      body('startDate').isDate().withMessage('Start date should be a valid date')
    ];

    // Run validation checks
    try {
      await Promise.all(validations.map(validation => validation.run(req)));
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'Validation failed' });
    }
  }

  // Validate policyholder creation
  static async validatePolicyholderCreate(req, res, next) {
    // Define validation rules for policyholders
    const validations = [
      body('name').notEmpty().withMessage('Name is required'),
      body('email').isEmail().withMessage('Email should be valid'),
      body('contact').isMobilePhone().withMessage('Contact should be a valid phone number')
    ];

    // Run validation checks
    try {
      await Promise.all(validations.map(validation => validation.run(req)));
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'Validation failed' });
    }
  }
}

export default ValidationMiddleware;
