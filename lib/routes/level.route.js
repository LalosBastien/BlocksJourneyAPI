import express from 'express';
import authMiddleware from '../middlewares/authentication.middleware';
import { LevelController } from '../controllers';
import { getAll, findById, update, remove, findObjectifsByIdLevel } from './level.validator';
import validator from '../middlewares/validator';

const router = express.Router();

router.get('/', authMiddleware, validator(getAll), LevelController.getAll);
router.get('/history', authMiddleware, LevelController.history);
router.get('/:id', authMiddleware, validator(findById), LevelController.findById);
router.put('/:id', authMiddleware, validator(update), LevelController.update);
router.put('/:id/validate', authMiddleware, LevelController.validate);
router.delete('/:id', authMiddleware, validator(remove), LevelController.delete);
router.get('/objectifs/:idLevel', authMiddleware, validator(findObjectifsByIdLevel), LevelController.findObjectifsByIdLevel);

export default router;
