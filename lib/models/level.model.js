import getTypedProperties from './models.module';
import sequelize from '../middlewares/db.middleware';
import { LevelStructure } from './structures';
import User from './user.model';
import Stats from './stats.model';
import Chapter from './chapter.model';

console.log(LevelStructure);

const Level = sequelize.define(LevelStructure.name, getTypedProperties(LevelStructure), {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

User.belongsToMany(Level, { through: { model: Stats, unique: false } });
Level.belongsToMany(User, { through: { model: Stats, unique: false } });
Chapter.hasMany(Level, {
    as: 'levels',
    foreignKey: 'chapterId'
});

export default Level;
