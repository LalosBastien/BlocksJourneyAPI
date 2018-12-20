import express from 'express';
import { AuthenticationController } from '../controllers';
import { login, logout, register, resetPassword, askResetPassword } from './authentication.validator';
import validator from '../middlewares/validator';
import authMiddleware from '../middlewares/authentication.middleware';

const router = express.Router();

router.post('/login', validator(login), AuthenticationController.login);
router.get('/logout', authMiddleware, validator(logout), AuthenticationController.logout);
router.post('/register', validator(register), AuthenticationController.register);
router.post('/resetPassword/', validator(resetPassword), AuthenticationController.resetPassword);
router.get('/askResetPassword/', validator(askResetPassword), AuthenticationController.sendResetMail);

export default router;
