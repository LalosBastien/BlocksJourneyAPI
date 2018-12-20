import express from 'express';
import authMiddleware from '../middlewares/authentication.middleware';
import { RoleController } from '../controllers';
import { getAll, findById, update, remove } from './level.validator';
import validator from '../middlewares/validator';
const router = express.Router();

router.get('/', validator(getAll), RoleController.getAll);
router.get('/:id', authMiddleware, validator(findById), RoleController.findById);
router.put('/:id', authMiddleware, validator(update), RoleController.update);
router.delete('/:id', authMiddleware, validator(remove), RoleController.delete);

export default router;
