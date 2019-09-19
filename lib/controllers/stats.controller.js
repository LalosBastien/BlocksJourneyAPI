/* eslint-disable no-await-in-loop */
import { profService, levelService, statService } from '../services';


export default class StatsController {
    // eslint-disable-next-line consistent-return
    static async ladder(req, res, next) {
        try {
            const ladder = await profService.ladder(req.user);
            if (!ladder) throw new Error('Data Unavailable');
            let ladderWithProgress = await Promise.all(Object.values(ladder).map(async (s) => {
                const progress = await levelService.findHistoryOf(s);
                return {
                    ...s.dataValues,
                    progress,
                };
            }));

            // eslint-disable-next-line no-nested-ternary,no-confusing-arrow
            ladderWithProgress = ladderWithProgress.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));

            res.json(ladderWithProgress);
        } catch (err) {
            // eslint-disable-next-line
            console.log('err', err);
            next(err);
        }
    }
    static async statsGlobal(req, res) {
        try {
            const globalHistory = await statService.globalHistory();
            globalHistory = globalHistory.map(x => x.dataValues);
            const students = await profService.ladder(req.user)
                .map(x => x.dataValues).map(x => ({ id: x.id, nom: x.nom, prenom: x.prenom }));
            const myStudentsStats = globalHistory
                // eslint-disable-next-line no-shadow
                .filter(x => students.map(x => x.id).includes(x.userId));
            const levels = await levelService.getAll().map(x => x.dataValues);
            const studentsWithHistories = await Promise.all(Object.values(students)
                .map(async (s) => {
                    const currH = await statService.historyByUser(s.id).map(x => x.dataValues);
                    if (currH && currH.length) {
                        const doneH = currH
                            .filter(h => h.status === 'success');
                        const inProgress = currH
                            .filter(h => h.status === 'in progress' && h.status === 'failed');
                        const doneReduced = [];
                        const inProgressReduced = [];

                        // eslint-disable-next-line array-callback-return
                        doneH.map((c) => {
                            if (!doneReduced.includes(c.LevelId))
                            { doneReduced.push(c.LevelId); }
                        });

                        // eslint-disable-next-line array-callback-return
                        inProgress.map((c) => {
                            if (!inProgressReduced.includes(c.LevelId))
                            { inProgressReduced.push(c.LevelId); }
                        });
                        // eslint-disable-next-line no-param-reassign
                        s.done = (doneH.length === levels.length);
                        // eslint-disable-next-line no-param-reassign
                        s.inProgress = (inProgress.length > 0 || doneH.length > 0);
                        // eslint-disable-next-line no-param-reassign
                        s.completeTab = doneReduced;
                        // eslint-disable-next-line no-param-reassign
                        s.inProgressTab = inProgressReduced;
                    }
                    return s;
                }));
            const globalCompleteStudents = studentsWithHistories
                .filter(x => x.done === true);
            const globalComplete = globalCompleteStudents.length / students.length;
            const globalInProgressStudents = studentsWithHistories
                .filter(x => x.inProgress === true && !globalCompleteStudents.includes(x));
            const globalInProgress = globalInProgressStudents.length / students.length;
            const globalProgressNotStarted = 1 - globalInProgress - globalComplete;

            const globalProgress = {
                notStarted: globalProgressNotStarted,
                inProgress: globalComplete,
                complete: globalInProgress,
            };
            const notStartedByLevel = [];
            const inProgressByLevel = [];
            const completeByLevel = [];

            Object.values(levels).map(async (l) => {
                const inProgress = globalInProgressStudents
                    .filter(x => x.inProgressTab.includes(l.id) || x.completeTab.includes(l.id));
                const complete = globalCompleteStudents
                    .filter(x => x.completeTab.includes(l.id));
                const inP = inProgress.length;
                const cplt = complete.length;
                const nS = students.length - (inP + cplt);
                inProgressByLevel.push(((inP / students.length) * 100));
                completeByLevel.push(((cplt / students.length) * 100));
                notStartedByLevel.push(((nS / students.length) * 100));
            });
            const seriesByLevel = {
                notStarted: notStartedByLevel,
                inProgress: inProgressByLevel,
                complete: completeByLevel,
            };
            const progressByLevel = {
                xAxis: levels.map(l => l.name),
                series: seriesByLevel,
            };
            const statsGlobal = {
                nbStudent: students.length,
                nbGamePlayed: myStudentsStats.length,
                nbLevels: levels.length,
                globalProgress,
                progressByLevel,
            };
            res.json(statsGlobal);
        } catch (err) {
            throw (err);
        }
    }


    static async statsByLevel(req, res) {
        try {
            let levels = await levelService.getAll();
            levels = await Promise.all(levels.map(async (entry) => {
                const students = await profService.ladder(req.user).map(user => user.id);
                const history = await entry
                    .getUtilisateurs({ where: { id: students }, attributes: ['id', 'nom', 'prenom'] })
                    .filter(h => h.Stats.status === 'success');
                return {
                    level: entry,
                    stats: {
                        algoTime: statService.calculateStat(history, 'algoTime'),
                        totalTime: statService.calculateStat(history, 'totalTime'),
                        energy: statService.calculateStat(history, 'energy'),
                    },
                };
            }));
            res.json(levels);
        } catch (err) {
            throw (err);
        }
    }
}
