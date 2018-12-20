import Service from './service';
import UserModel from '../models/user.model';
import RoleModel from '../models/role.model';
import { generateResetToken } from '../util/tokenUtil';

export default class UserService extends Service {
    constructor() {
        super(UserModel);
    }

    /**
     * Find element by id override
     * @param  {String} id
     * @param  {[String]} fields *optionnal*
     *         if specified the request will only return those mysql fields
     * @return {Promise} Sequelize promise
     */
    findById(id, fields) {
        const where = {};
        where.id = id;
        if (fields) { return this.model.findOne({ where, attributes: fields, include: { model: RoleModel, as: 'role' } }); }
        return this.model.findOne({ where, include: { model: RoleModel, as: 'role' } });
    }

    /**
     * Find element by login
     * @param  {String} login
     * @param  {[String]} fields *optionnal*
     *         if specified the request will only return those mysql fields
     * @return {Promise} Sequelize promise
     */
    findByLogin(login, fields) {
        const where = {};
        where.login = login;
        if (fields) { return this.model.findOne({ where, attributes: fields }); }
        return this.model.findOne({ where });
    }
    /**
     * Find element by email
     * @param  {String} email
     * @param  {[String]} fields *optionnal*
     *         if specified the request will only return those mysql fields
     * @return {Promise} Sequelize promise
     */
    findByEmail(email, fields) {
        const where = {};
        where.email = email;
        if (fields) { return this.model.findOne({ where, attributes: fields }); }
        return this.model.findOne({ where });
    }
    /**
     * Find element by verification token
     * @param  {String} token
     * @param  {[String]} fields *optionnal*
     *         if specified the request will only return those mysql fields
     * @return {Promise} Sequelize promise
     */
    findByVerifToken(token, fields) {
        const where = {};
        where.verifToken = token;
        if (fields) { return this.model.findOne({ where, attributes: fields }); }
        return this.model.findOne({ where });
    }
    /**
     * Set the user field "verifToken" to a new generated one
     * @param  {Number} id
     * @return {Promise} Sequelize promise
     */
    setVerifToken(id) {
        const where = {};
        where.id = id;
        return this.model.update({ verifToken: generateResetToken() }, { where });
    }
    /**
     * Set the user field "verifToken" to null
     * @param  {Number} id
     * @return {Promise} Sequelize promise
     */
    unsetVerifToken(id) {
        const where = {};
        where.id = id;
        return this.model.update({ verifToken: null }, { where });
    }

    /**
     * Update the password for the selected user
     * @param  {Number} id
     * @param  {String} password
     * @return {Promise} Sequelize promise
     */
    updatePassword(id, password) {
        const where = {};
        where.id = id;
        return this.model.update({ password }, { where });
    }
}
