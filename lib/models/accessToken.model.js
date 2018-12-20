import getTypedProperties from './models.module';
import sequelize from '../middlewares/db.middleware';
import { ATStructure } from './structures';

export default sequelize.define(ATStructure.name, getTypedProperties(ATStructure), {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});
