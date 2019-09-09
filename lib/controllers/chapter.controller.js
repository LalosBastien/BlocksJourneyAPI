import status from 'http-status';
import { chapterService, levelService } from '../services';

export default class ChapterController {
    // eslint-disable-next-line consistent-return
    static async getAll(req, res) {
        try {
            const list = await chapterService.getAllWithLevels();
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
            let chapter = await chapterService.findById(req.params.id);

            const levels = await levelService.findArrayByField('chapterId', req.params.id);

            chapter = {
                ...JSON.parse(JSON.stringify(chapter)),
                levels,
            };
            res.json({
                message: 'Success',
                chapter,
            });
        } catch (err) {
            next(err);
        }
    }
    // eslint-disable-next-line consistent-return
    static async update(req, res, next) {
        try {
            if ((await chapterService.update(req.params.id, req.body))[0] > 0) {
                return res.status(status.OK).json({
                    message: 'chapter updated successfully',
                });
            }
            return res.status(status.NOT_FOUND).json({
                message: 'chapter did not update',
            });
        } catch (err) {
            next(err);
        }
        return Promise.resolve();
    }
    // eslint-disable-next-line consistent-return
    static async delete(req, res, next) {
        try {
            await chapterService.delete(req.params.id);
            res.json({
                message: 'chapter deleted successfully',
            });
        } catch (err) {
            next(err);
        }
    }
    static async validate(req, res, next) {
        try {
            const chapter = await chapterService.findById(req.params.id);
            await chapterService.validateChapter(chapter, req.user, req.body);
            res.json({
                message: 'chapter validated successfully',
            });
        } catch (err) {
            next(err);
        }
    }
}
