/* eslint-disable no-await-in-loop */
import status from 'http-status';
import { userService, profService, levelService } from '../services';
import { hashPassword, doesPasswordMatch } from '../util/cryptoUtil';
import { sendInviteMail } from '../util/mailerUtil';

export default class UserController {
    // eslint-disable-next-line consistent-return
    static async getAll(req, res, next) {
        try {
            const listUsers = await userService.getAll();
            return res.status(status.OK).json({ message: 'Liste des Utilisateurs', listUsers });
        } catch (err) {
            return res.status(status.UNAUTHORIZED).json(err.message);
        }
    }
    // eslint-disable-next-line consistent-return
    static async findById(req, res, next) {
        try {
            const publicFields = ['id', 'nom', 'prenom', 'login', 'email', 'rue', 'ville']
            const user = await userService.findById(req.params.id, publicFields);
            res.json(user);
        } catch (err) {
            next(err);
        }
    }
    // eslint-disable-next-line consistent-return
    static async update(req, res, next) {
        try {
            if (req.body.password) {
                const user = await userService.findById(req.params.id, ['password']);
                if (!await doesPasswordMatch(req.body.oldPassword, user.password)) {
                    return next({ message: 'Old password is invalid !' });
                }
                req.body.password = await hashPassword(req.body.password);
            }

            if ((await userService.update(req.params.id, req.body))[0] > 0) {
                return res.status(status.OK).json({ message: 'User updated successfully' });
            }
            return res.status(status.NOT_FOUND).json({ message: 'User did not update' });
        } catch (err) {
            next(err);
        }
        return Promise.resolve();
    }
    // eslint-disable-next-line consistent-return
    static async delete(req, res, next) {
        try {
            await userService.delete(req.params.id);
            res.json({ message: 'User deleted successfully' });
        } catch (err) {
            next(err);
        }
    }
    // eslint-disable-next-line consistent-return
    static async invite(req, res, next) {
        try {
            const notSend = [];
            for (let i = 0; i < req.body.emails.length; i += 1) {
                const user = await userService.findByField('email', req.body.emails[i]);
                if (user) {
                    await sendInviteMail(req.body.emails[i], req.user.dataValues);
                }
                else {
                    notSend.push(req.body.emails[i]);
                }
            }
            res.json({
                message: notSend.length > 0 ? 'Some email were not send' : 'Invitation email sent successfully',
                notSend: notSend.length > 0 ? notSend : null,
            });
        } catch (err) {
            next(err);
        }
    }
    // eslint-disable-next-line consistent-return
    static async acceptProf(req, res, next) {
        try {
            const prof = await userService.findById(req.params.profId);
            req.user.addProf(prof);
            res.json({ message: 'Prof accepted successfully' });
        } catch (err) {
            next(err);
        }
    }
}
