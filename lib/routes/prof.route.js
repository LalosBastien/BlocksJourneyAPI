import express from 'express';
import authMiddleware from '../middlewares/authentication.middleware';
import { UserController, StatsController, AuthenticationController } from '../controllers';
import { invite, accept, addStudents, renewStudent } from './prof.validator';
import validator from '../middlewares/validator';
import requiredRole from '../middlewares/role.middleware';
const router = express.Router();

router.post('/invite', authMiddleware, requiredRole(2), validator(invite), UserController.invite);
router.get('/accept/:profId', authMiddleware, validator(accept), UserController.acceptProf);

router.get('/students', authMiddleware, requiredRole(2), UserController.students);
router.post('/students', authMiddleware, requiredRole(2), validator(addStudents), AuthenticationController.autoRegisterStudents);
router.delete('/student/:id', authMiddleware, requiredRole(2), UserController.deleteStudent);
router.post('/renew', authMiddleware, requiredRole(2), validator(renewStudent), AuthenticationController.renewStudent);

router.get('/ladder', authMiddleware, requiredRole(2), StatsController.ladder);
router.get('/statsGlobal', authMiddleware, StatsController.statsGlobal);
router.get('/statsByLevel', authMiddleware, StatsController.statsByLevel);
export default router;
