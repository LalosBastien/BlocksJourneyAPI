import Service from './service';
import StatsModel from '../models/stats.model';
import LevelModel from '../models/level.model';
import UserModel from '../models/user.model';
import levels from '../levels';
const levelsCount = Object.keys(levels).length;

export default class LevelService extends Service {
    constructor() {
        super(LevelModel);
    }

    /**
     * Create a stat (joint between user and level)
     * @param  {Object} level
     * @param  {Object} user
     * @return {Promise} Sequelize Promise
     */
    createStats(level, user) {
        const newStat = {
            levelId: level.id,
            userId: user.id,
            status: 'in_progress',
            tryNumber: 0,
        };
        return StatsModel.create(newStat);
    }

    /**
     * Validate a level
     * @param  {Object} level
     * @param  {Object} user
     * @param  {Object} infos stats info given in req.body
     * @return {Promise} Sequelize Promise
     */
    async validateLevel(level, user, infos) {
        const {
            status, algoTime, energyConsumed, stars,
        } = infos;
        const stats = (await user.getLevels())
            .map(x => x.dataValues.Stats)
            .find(x => x.dataValues.LevelId === level.id && x.dataValues.status === 'in_progress');
        if (!stats) {
            return Promise.reject(new Error('Level not started'));
        }
        stats.status = status;
        stats.algoTime = algoTime || 0;
        stats.energy = energyConsumed;
        stats.stars = stars || 0;
        stats.totalTime = Math.abs(new Date(stats.createdAt) - new Date()) / 1000;
        return stats.save();
    }

    async getLevelsWithHistory() {
        const result = await this.model.findAll({ include: { model: UserModel } });
        return result;
    }

    /**
     * List of the students
     * @param  {Object} user
     * @return {Array} Sequelize Array
     */
    async findHistoryOf(user) {
        const levelHistory = await user.getLevels();
        const history = [];
        levelHistory.map(x => x.dataValues).forEach((dbLevel) => {
            const savedLevel = history.find(x => x.id === dbLevel.id);
            const levelStatus = dbLevel.Stats.dataValues.status;
            if (savedLevel) {
                if (savedLevel.status !== 'success') {
                    savedLevel.status = levelStatus && (levelStatus === 'in_progress' || levelStatus === 'failed') ? 'in_progress' : 'success';
                }
                savedLevel.history.push(dbLevel.Stats.dataValues);
            }
            else {
                history.push({
                    id: dbLevel.id,
                    name: dbLevel.name,
                    difficulty: dbLevel.difficulty,
                    history: [{
                        ...dbLevel.Stats.dataValues,
                    }],
                    status: levelStatus === 'failed' ? 'in_progress' : levelStatus,
                });
            }
        });
        const doneList = history.reduce((total, level) => {
            if (level.history.filter(x => x.status === 'success').length > 0) {
                return total + 1;
            }
            return total;
        }, 0);
        const progression = doneList / levelsCount;
        return { progression, levels: history };
    }
}
