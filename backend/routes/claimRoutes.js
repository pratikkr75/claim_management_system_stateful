import express from 'express';
import claimController from '../controllers/claimController.js';

const router = express.Router();

router.post('/', claimController.createClaim);
router.get('/:id', claimController.getClaimById);
router.put('/:id', claimController.updateClaim); // Add PUT for updating claims
router.delete('/:id', claimController.deleteClaim); // Add DELETE for deleting claims

export default router;
