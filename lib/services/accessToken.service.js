import Service from './service';
import ATModel from '../models/accessToken.model';
import { generateAccessToken } from '../util/tokenUtil';

export default class AccessTokenService extends Service {
    constructor() {
        super(ATModel);
    }

    /**
     * Check if token is valid
     *
     * @param {Object} schema The Joi schema
     * @return {Integer} User owner id, or false
     */
    async isTokenValid(token) {
        const currentAT = await this.findByField('token', token, null);
        const now = new Date();
        if (currentAT && currentAT.expireDate > now) {
            return currentAT.idUtilisateur;
        }
        return false;
    }
    async createToken(idUtilisateur) {
        const expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (24 * 60 * 60 * 1000));
        const newToken = {
            idUtilisateur,
            token: generateAccessToken(),
            expireDate,
        };
        return this.create(newToken);
    }
    findLastByIdUser(id) {
        const where = {};
        where.id = id;
        const order = [['expireDate', 'DESC']];
        return this.model.findOne({ where, order });
    }
}
