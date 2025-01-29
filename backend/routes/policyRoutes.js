import express from 'express';
import policyController from '../controllers/policyController.js';

const router = express.Router();

router.post('/', policyController.createPolicy);
router.get('/:id', policyController.getPolicyById);
router.put('/:id', policyController.updatePolicy); // PUT for updating the policy details
router.delete('/:id', policyController.deletePolicy); // DELETE for deleting a policy
router.patch('/:id', policyController.updateCoverage); // PATCH for updating the coverage

export default router;
