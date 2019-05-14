import getTypedProperties from './models.module';
import sequelize from '../middlewares/db.middleware';
import { ObjectifMappingStructure } from './structures';
import Level from './level.model';
import Objectif from './objectif.model';

const ObjectifMapping = sequelize.define(ObjectifMappingStructure.name, getTypedProperties(ObjectifMappingStructure), {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

Level.belongsToMany(Objectif, { through: { model: ObjectifMapping, unique: false } });
Objectif.belongsToMany(Level, { through: { model: ObjectifMapping, unique: false } });

export default ObjectifMapping;
