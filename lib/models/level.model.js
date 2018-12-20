import getTypedProperties from './models.module';
import sequelize from '../middlewares/db.middleware';
import { LevelStructure } from './structures';
import User from './user.model';
import Stats from './stats.model';

const Level = sequelize.define(LevelStructure.name, getTypedProperties(LevelStructure), {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

User.belongsToMany(Level, { through: { model: Stats, unique: false } });
Level.belongsToMany(User, { through: { model: Stats, unique: false } });

export default Level;
