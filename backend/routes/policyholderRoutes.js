import express from 'express';
import policyholderController from '../controllers/policyholderController.js';

const router = express.Router();

// Route to create a new policyholder
router.post('/', policyholderController.createPolicyholder);

// Route to get a policyholder by ID (instead of email)
router.get('/:id', policyholderController.getPolicyholderById);

// PUT route to update a policyholder's details
router.put('/:id', policyholderController.updatePolicyholder);

// DELETE route to delete a policyholder by UUID
router.delete('/:id', policyholderController.deletePolicyholder);

export default router;
