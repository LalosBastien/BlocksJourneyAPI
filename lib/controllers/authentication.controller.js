import status from 'http-status';

import {
    userService,
    atService,
    roleService,
    profService
} from '../services';
import {
    hashPassword,
    doesPasswordMatch
} from '../util/cryptoUtil';
import {
    sendResetMail
} from '../util/mailerUtil';
import {
    generatePasswordToken
} from '../util/tokenUtil';

export default class AuthenticationController {
    static async login(req, res) {
        try {
            const {
                login,
                password
            } = req.body;
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
            return res.status(status.OK).json({
                message: 'Connexion effectuée',
                accessToken
            });
        } catch (err) {
            return res.status(status.UNAUTHORIZED).json(err.message);
        }
    }

    static async logout(req, res) {
        const token = req.header('x-accesstoken');
        const accessToken = await atService.findLastByIdUser(token.idUser);
        if (accessToken && accessToken.id) atService.delete(accessToken.id);
        return res.status(status.OK).json({
            message: 'Deconnexion effectuée'
        });
    }

    static async register(req, res) {
        let user = req.body;
        try {
            user.password = await hashPassword(req.body.password);
            if (await userService.findByLogin(req.body.login, ['id'])) {
                throw new Error('Identifiant non disponible');
            }
            const {
                profId,
                role
            } = req.body;
            const theRole = await roleService.findByField('accessLevel', role, null);
            user.roleId = theRole.id;
            if (profId != '') {
                const professor = await userService.getUserFromProfId(profId);
                if (professor != null) {
                    user = await userService.create(user);
                    user.addProf(professor);
                } else {
                    throw new Error("idProf invalide");
                }
            } else {
                await userService.create(user);
            }
            return res.status(status.OK).json({
                message: 'Inscription effectuée'
            });
        } catch (err) {
            return res.status(status.UNAUTHORIZED).json(err.message);
        }
    }

    static async autoRegisterStudents(req, res) {
        let students = req.body.students;
        const professor = req.user;
        try {
            for (let student of students) {
                const password = generatePasswordToken();
                const hash = await hashPassword(password);
                student.login = profService.generateStudentLogin(req.user, student);
                const user = await userService.create({
                    ...student,
                    password: hash
                });
                user.addProf(professor.id);
                student.password = password;
            }
            return res.status(status.OK).json({
                students: students
            });
        } catch (error) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({
                students: students,
                message: error.message
            })
        }
    }

    static async renewStudent(req, res) {
        try {
            console.log("renew start");
            const students = [];
            for (const studentId of req.body) {
                const student = await userService.findById(studentId);
                if (!student.hasProf(req.user)) {
                    console.log("Unauthorized action from user #" + req.user.id + ": trying to renew " + studentId);
                    students.push({
                        id: studentId,
                        password: ""
                    })
                }
                const newPassword = generatePasswordToken();
                await userService.updatePassword(student.id, await hashPassword(newPassword));
                students.push({
                    id: studentId,
                    password: newPassword
                })
            }
            return res.status(status.OK).json(students);
        } catch (error) {
            return res.status(status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    // eslint-disable-next-line consistent-return
    static async sendResetMail(req, res) {
        try {
            const user = await userService.findByEmail(req.query.email);
            if (user && user.dataValues && user.dataValues.id) {
                const updatedUser = await userService.setVerifToken(user.dataValues.id);
                if (!updatedUser) throw new Error("L'initialisation du token a échoué");
                const {
                    verifToken,
                    email
                } = await userService.findById(user.dataValues.id);
                const mailSend = await sendResetMail(email, verifToken);
                if (!mailSend) throw new Error("Echec lors de l'envoi de l'email de réinitialisation");
                return res.status(status.OK).json({
                    message: 'Email de réinitialisation envoyé'
                });
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
                const {
                    id
                } = user.dataValues;
                const updatedUser = await userService.updatePassword(id, newPassword);
                if (!updatedUser) throw new Error('Echec lors de la mise à jour du mot de passe');
                userService.unsetVerifToken(user.dataValues.id);
                return res.status(status.OK).json({
                    message: 'Mise à jour du mot de passe effectuée'
                });
            }
        } catch (err) {
            return res.status(status.UNAUTHORIZED).json(err.message);
        }
    }
}