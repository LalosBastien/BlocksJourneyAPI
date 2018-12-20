import getTypedProperties from './models.module';
import sequelize from '../middlewares/db.middleware';
import { RoleStructure } from './structures';

const Role = sequelize.define(RoleStructure.name, getTypedProperties(RoleStructure), {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});


export default Role;
