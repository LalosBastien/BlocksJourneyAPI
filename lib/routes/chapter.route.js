import express from 'express';
import authMiddleware from '../middlewares/authentication.middleware';
import ChapterController from '../controllers/chapter.controller';
import { getAll, findById, update,remove } from './chapter.validator';
import validator from '../middlewares/validator';

const router = express.Router();

router.get('/', authMiddleware, validator(getAll), ChapterController.getAll);
router.get('/levels', authMiddleware, ChapterController.levels);
router.get('/:id', authMiddleware, validator(findById), ChapterController.findById);
router.put('/:id', authMiddleware, validator(update), ChapterController.update);
router.put('/:id/validate', authMiddleware, ChapterController.validate);
router.delete('/:id', authMiddleware, validator(remove), ChapterController.delete);

export default router;