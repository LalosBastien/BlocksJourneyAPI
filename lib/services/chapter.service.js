import Service from './service';
import ChapterModel from '../models/chapter.model';
import LevelModel from '../models/level.model';

export default class ChapterService extends Service {
    constructor() {
        super(ChapterModel);
    }

    async getAllWithLevels() {
        const result = await this.model.findAll({
            include: {
                model: LevelModel,
                as: 'levels',
            },
        });
        return result;
    }
}
