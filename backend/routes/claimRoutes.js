import express from 'express';
import claimController from '../controllers/claimController.js';

const router = express.Router();

router.post('/', claimController.createClaim);
router.get('/:id', claimController.getClaimById);

export default router;
