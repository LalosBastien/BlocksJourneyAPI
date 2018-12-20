/** Generic sequelize CRUD Service */

export default class Service {
    /**
     * BaseClass constructor
     * @param  {Model} model Seqelize model to attach
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * Find element by id
     * @param  {Number} id id of the element
     * @param  {[String]} fields *optionnal*
     *         if specified the request will only return those mysql fields
     * @return {Promise} Sequelize promise
     */
    findById(id, fields) {
        const where = {};
        where.id = id;
        if (fields) {
            return this.model.findOne({ where, attributes: fields });
        }
        return this.model.findOne({ where });
    }

    /**
     * Find element by id
     * @param  {String} field name of the field to search
     * @param  {String|Number} value id of the element
     * @param  {[String]} fields *optionnal*
     *         if specified the request will only return those mysql fields
     * @return {Promise} Sequelize promise
     */
    findByField(field, value, fields) {
        const where = {};
        where[field] = value;
        if (fields) {
            return this.model.findOne({ where, attributes: fields });
        }
        return this.model.findOne({ where });
    }

    findArrayByField(field,value,fields){
        const where = {};
        where[field] = value;
        if (fields) {
            return this.model.findAll({ where, attributes: fields });
        }
        return this.model.findAll({ where });
    }
    /**
     * Find all elements
     * @param  {[String]} fields *optionnal*
     *         if specified the request will only return those mysql fields
     * @return {Promise} Sequelize promise
     */
    getAll(fields) {
        if (fields) {
            return this.model.findAll({ attributes: fields });
        }
        return this.model.findAll();
    }

    /**
     * Update an element with specified
     * @param  {Number} id id of the element
     * @param  {Object} attributes the list of fields to update with their new value
     * @return {Promise} Sequelize promise
     */
    update(id, attributes) {
        const where = {};
        where.id = id;
        return this.model.update(attributes, { where });
    }

    /**
     * Update an element with specified
     * @param  {Object} attributes of the element to create
     * @return {Promise} Sequelize promise
     */
    create(attributes) {
        return this.model.create(attributes);
    }

    /**
     * Remove an element by its id
     * @param  {Number} id id of the element
     * @return {Promise} Sequelize promise
     */
    async delete(id) {
        const object = await this.findById(id);
        return object.destroy();
    }
}
