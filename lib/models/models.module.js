// Modules
import Sequelize from 'sequelize';
import sequelize from './../middlewares/db.middleware';

const getSequelizeType = (type) => {
    const types = ['string', 'integer', 'boolean', 'float', 'date'];
    if (types.indexOf(type) > -1) {
        return Sequelize[type.toUpperCase()];
    }
    throw new Error('Unknown sequelize type');
};

sequelize.define();

export default (structure) => {
    const { properties } = structure;
    return Object.keys(properties).reduce((acc, current) => {
        acc[current] = properties[current];
        acc[current].type = getSequelizeType(acc[current].type);
        return acc;
    }, {});
};
