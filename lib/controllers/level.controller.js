import status from 'http-status';
import {
    levelService,
    userService,
    objectifService,
} from '../services';
import levels from '../levels';

export default class LevelController {
    // eslint-disable-next-line consistent-return
    static async getAll(req, res) {
        try {
            const list = await levelService.getAll();
            return res.status(status.OK).json({
                message: 'Success',
                list,
            });
        } catch (err) {
            return res.status(status.UNAUTHORIZED).json(err.message);
        }
    }
    // eslint-disable-next-line consistent-return
    static async findById(req, res, next) {
        try {
            const level = await levelService.findById(req.params.id);
            const stats = (await req.user.getLevels())
                .map(x => x.dataValues.Stats.dataValues)
                .filter(x => x.LevelId === parseInt(req.params.id, 10) && x.status === 'in_progress');
            if (stats.length === 0) {
                levelService.createStats(level, req.user);
            }
            const levelInfo = levels[`level${req.params.id}`];
            if (!levelInfo) {
                return res.status(status.NOT_FOUND).json({
                    message: 'Level not found',
                });
            }
            res.json({
                message: {
                    level,
                    levelInfo,
                },
            });
        } catch (err) {
            next(err);
        }
    }
    // eslint-disable-next-line consistent-return
    static async update(req, res, next) {
        try {
            if ((await levelService.update(req.params.id, req.body))[0] > 0) {
                return res.status(status.OK).json({
                    message: 'Level updated successfully',
                });
            }
            return res.status(status.NOT_FOUND).json({
                message: 'Level did not update',
            });
        } catch (err) {
            next(err);
        }
        return Promise.resolve();
    }
    // eslint-disable-next-line consistent-return
    static async delete(req, res, next) {
        try {
            await levelService.delete(req.params.id);
            res.json({
                message: 'Level deleted successfully',
            });
        } catch (err) {
            next(err);
        }
    }
    static async history(req, res, next) {
        try {
            let {
                user,
            } = req;
            if (req.user.role.accessLevel >= 2 && req.query.id) {
                user = await userService.findById(req.query.id);
            }

            res.json(await levelService.findHistoryOf(user));
        } catch (err) {
            next(err);
        }
    }
    static async validate(req, res, next) {
        try {
            const level = await levelService.findById(req.params.id);
            await levelService.validateLevel(level, req.user, req.body);
            res.json({
                message: 'Level validated successfully',
            });
        } catch (err) {
            next(err);
        }
    }
    static async findObjectifsByIdLevel(req, res, next) {
        try {
            const {
                idLevel,
            } = req.params;
            const objectifs = await objectifService.findByIdLevel(idLevel);
            res.json({
                message: 'Succes',
                objectifs,
            });
        } catch (err) {
            next(err);
        }
    }
}
