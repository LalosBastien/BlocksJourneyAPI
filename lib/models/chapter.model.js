import getTypedProperties from './models.module';
import sequelize from '../middlewares/db.middleware';
import { ChapterStructure } from './structures';

const Chapter = sequelize.define(ChapterStructure.name, getTypedProperties(ChapterStructure), {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

export default Chapter;
