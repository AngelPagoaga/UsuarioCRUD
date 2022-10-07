import express from 'express';
const router  = express.Router();
import UserRouter from './Users';
router.use('/user', UserRouter)

export default router;
