import getTypedProperties from './models.module';
import sequelize from '../middlewares/db.middleware';
import { ObjectifMappingStructure } from './structures';

const ObjectifMapping = sequelize.define(ObjectifMappingStructure.name, getTypedProperties(ObjectifMappingStructure), {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

export default ObjectifMapping;
