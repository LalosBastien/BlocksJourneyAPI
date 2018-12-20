import express from 'express';
import authMiddleware from '../middlewares/authentication.middleware';
import { UserController,StatsController} from '../controllers';
import { ladder, invite, accept } from './prof.validator';
import validator from '../middlewares/validator';
import requiredRole from '../middlewares/role.middleware';
const router = express.Router();

router.post('/invite', authMiddleware, requiredRole(2), validator(invite), UserController.invite);
router.get('/accept/:profId', authMiddleware, validator(accept), UserController.acceptProf);

router.get('/ladder', authMiddleware, requiredRole(2), validator(ladder), StatsController.ladder);
router.get('/statsGlobal', authMiddleware ,StatsController.statsGlobal)
router.get('/statsByLevel', authMiddleware ,StatsController.statsByLevel)
export default router;
