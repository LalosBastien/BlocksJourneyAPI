import { atService, userService } from '../services';

export default async (req, res, next) => {
    const token = req.header('x-accesstoken');
    const userId = await atService.isTokenValid(token);
    if (userId) {
        req.user = await userService.findById(userId);
        return next();
    }
    return next({ code: 403, message: 'Votre session a expiré. Veuillez vous reconnecter pour pouvoir utiliser l\'application' });
};
