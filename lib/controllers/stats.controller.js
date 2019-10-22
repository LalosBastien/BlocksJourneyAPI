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
            const studentList = await profService.ladder(req.user).map(s => s.dataValues);
            let studentsStats = await Promise.all(studentList.map(s => statService.historyByUser(s.id)));
            studentsStats = ([].concat.apply([], studentsStats));
            studentsStats = studentsStats.map(x => x.dataValues);

            const levels = await levelService.getAll().map(x => x.dataValues);

            const progressionByStudents = studentList.map(student => {
                const studentStats = studentsStats.filter(stat => stat.userId === student.id);
                studentStats.sort((a, b) => a.status.localeCompare(b.status)).reverse();
                const data = studentStats.reduce((acc, cur) => {
                    const doneIds = acc.doneIds;
                    const inProgressIds = acc.inProgressIds;
                    if (cur.status === 'success' && !doneIds.includes(cur.levelId))
                        doneIds.push(cur.levelId);
                    else if ((cur.status === 'in_progress' || cur.status === 'failed') && !inProgressIds.includes(cur.levelId) && !doneIds.includes(cur.levelId))
                        inProgressIds.push(cur.levelId);
                    return {
                        studentId: student.id,
                        doneIds,
                        inProgressIds,
                    };
                }, {studentId: student.id, doneIds: [], inProgressIds: []});
                data.donePercentage = data.doneIds.length / levels.length;
                data.inProgressPercentage = data.inProgressIds.length / levels.length;
                data.notStartedPercentage = 1 - ((data.inProgressIds.length + data.doneIds.length) / levels.length);
                return data;
            });

            const progressionByLevels = levels.map(level => ({
                complete: progressionByStudents.filter(pbs => pbs.doneIds.includes(level.id)).length / studentList.length * 100,
                inProgress: progressionByStudents.filter(pbs => pbs.inProgressIds.includes(level.id)).length / studentList.length * 100,
            })).map(level => {
                level.notStarted = 100 - (level.inProgress + level.complete);
                return level;
            }).reduce((acc, cur) => {
                const newObj = acc;
                newObj.notStarted.push(cur.notStarted);
                newObj.inProgress.push(cur.inProgress);
                newObj.complete.push(cur.complete);
                return newObj;
            }, { notStarted: [], inProgress: [], complete: [] });

            const globalProgress = progressionByStudents.reduce((acc, cur) => {
                const newObj = acc;
                if (cur.donePercentage === 1) {
                    newObj.complete += 1 / studentList.length;
                } else if (cur.notStartedPercentage === 1 ) {
                    newObj.notStarted += 1 / studentList.length;
                } else {
                    newObj.inProgress += 1 / studentList.length;
                }
                return newObj;
            }, {complete: 0, inProgress: 0, notStarted: 0});

            const progressByLevel = {
                series: progressionByLevels,
                xAxis: levels.map(level => level.name)
            };

            const statsGlobal = {
                nbStudent: studentList.length,
                nbGamePlayed: studentsStats.length,
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
