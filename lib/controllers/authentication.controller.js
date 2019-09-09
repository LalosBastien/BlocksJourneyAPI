import status from 'http-status';

import { userService, atService, roleService } from '../services';
import { hashPassword, doesPasswordMatch } from '../util/cryptoUtil';
import { sendResetMail } from '../util/mailerUtil';

export default class AuthenticationController {
    static async login(req, res) {
        try {
            const { login, password } = req.body;
            const user = await userService.findByLogin(login, ['password', 'id']);
            if (!user || !await doesPasswordMatch(password, user.password)) {
                throw new Error('Identifiant ou mot de passe incorrect');
            }
            const userId = user.dataValues.id;
            let accessToken = await atService.findLastByIdUser(userId);
            if (accessToken && accessToken.id) {
                if (!await atService.isTokenValid(accessToken.id)) {
                    atService.delete(accessToken.id);
                    accessToken = null;
                }
            }
            if (accessToken == null) {
                accessToken = await atService.createToken(userId);
            }
            return res.status(status.OK).json({ message: 'Connexion effectuée', accessToken });
        } catch (err) {
            return res.status(status.UNAUTHORIZED).json(err.message);
        }
    }

    static async logout(req, res) {
        const token = req.header('x-accesstoken');
        const accessToken = await atService.findLastByIdUser(token.idUser);
        if (accessToken && accessToken.id) atService.delete(accessToken.id);
        return res.status(status.OK).json({ message: 'Deconnexion effectuée' });
    }

    static async register(req, res) {
        try {
            req.body.password = await hashPassword(req.body.password);
            if (await userService.findByLogin(req.body.login, ['id'])) {
                throw new Error('Identifiant non disponible');
            }
            const { profId, role } = req.body;

            const theRole = await roleService.findByField('accessLevel', role, null);
            req.body.roleId = theRole.id;
            const user = await userService.create(req.body);
            user.addProf(await userService.findById(profId));


            return res.status(status.OK).json({ message: 'Inscription effectuée' });
        } catch (err) {
            return res.status(status.UNAUTHORIZED).json(err.message);
        }
    }

    // eslint-disable-next-line consistent-return
    static async sendResetMail(req, res) {
        try {
            const user = await userService.findByEmail(req.query.email);
            if (user && user.dataValues && user.dataValues.id) {
                const updatedUser = await userService.setVerifToken(user.dataValues.id);
                if (!updatedUser) throw new Error("L'initialisation du token a échoué");
                const { verifToken, email } = await userService.findById(user.dataValues.id);
                const mailSend = await sendResetMail(email, verifToken);
                if (!mailSend) throw new Error("Echec lors de l'envoi de l'email de réinitialisation");
                return res.status(status.OK).json({ message: 'Email de réinitialisation envoyé' });
            }
        } catch (err) {
            return res.status(status.UNAUTHORIZED).json(err.message);
        }
    }

    // eslint-disable-next-line consistent-return
    static async resetPassword(req, res) {
        try {
            const user = await userService.findByVerifToken(req.body.token);
            if (user && user.dataValues && user.dataValues.id) {
                const newPassword = await hashPassword(req.body.password);
                const { id } = user.dataValues;
                const updatedUser = await userService.updatePassword(id, newPassword);
                if (!updatedUser) throw new Error('Echec lors de la mise à jour du mot de passe');
                userService.unsetVerifToken(user.dataValues.id);
                return res.status(status.OK).json({ message: 'Mise à jour du mot de passe effectuée' });
            }
        } catch (err) {
            return res.status(status.UNAUTHORIZED).json(err.message);
        }
    }
}
