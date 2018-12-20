import getTypedProperties from './models.module';
import sequelize from '../middlewares/db.middleware';
import { StatsStructure } from './structures';

const Stats = sequelize.define(StatsStructure.name, getTypedProperties(StatsStructure), {
    freezeTableName: true,
    updatedAt: false,
});

export default Stats;
