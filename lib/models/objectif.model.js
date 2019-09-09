import getTypedProperties from './models.module';
import sequelize from '../middlewares/db.middleware';
import { ObjectifStructure } from './structures';

const Objectif = sequelize.define(ObjectifStructure.name, getTypedProperties(ObjectifStructure), {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

export default Objectif;
