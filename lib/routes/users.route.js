import express from 'express';
import authMiddleware from '../middlewares/authentication.middleware';
import { UserController } from '../controllers';
import { getAll, findById, update, remove } from './users.validator';
import validator from '../middlewares/validator';
const router = express.Router();

router.get('/', authMiddleware, validator(getAll), UserController.getAll);
router.get('/:id', authMiddleware, validator(findById), UserController.findById);
router.put('/:id', authMiddleware, validator(update), UserController.update);
router.delete('/:id', authMiddleware, validator(remove), UserController.delete);

export default router;
