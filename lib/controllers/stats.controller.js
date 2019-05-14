/* eslint-disable no-await-in-loop */
import {profService, levelService, statService, userService} from '../services';


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
    static async statsGlobal(req, res, next) {
        try {
            let globalHistory = await statService.globalHistory();
            let students = await profService.ladder(req.user).map(x => x.dataValues).map(x => ({ id: x.id, nom: x.nom, prenom: x.prenom }));
            let myStudentsStats = globalHistory.filter(x => students.map(x => x.id).includes(x.userId));
            let levels = await levelService.getAll().map(x => x.dataValues);
            let studentsWithHistories = await Promise.all(Object.values(students).map(async s => {
                let currH = await statService.historyByUser(s.id).map(x => x.dataValues);
                if (currH && currH.length) {
                    let doneH = currH.filter(h => h.status == 'success');
                    let inProgress = currH.filter(h => h.status == 'in progress' && h.status == 'failed');
                    let doneReduced = [];
                    let inProgressReduced = [];
                    doneH.map((c) => { if (!doneReduced.includes(c.LevelId)) doneReduced.push(c.LevelId); })
                    inProgress.map((c) => { if (!inProgressReduced.includes(c.LevelId)) inProgressReduced.push(c.LevelId); })
                    s.done = (doneH.length == levels.length);
                    s.inProgress = (inProgress.length > 0 || doneH.length > 0);
                    s.completeTab = doneReduced;
                    s.inProgressTab = inProgressReduced;
                }
                return s;
            }));
            let globalCompleteStudents = studentsWithHistories.filter(x => x.done == true)
            let globalComplete = globalCompleteStudents.length / students.length;
            let globalInProgressStudents = studentsWithHistories.filter(x => x.inProgress == true && !globalCompleteStudents.includes(x))
            let globalInProgress = globalInProgressStudents.length / students.length;
            let globalProgressNotStarted = 1 - globalInProgress - globalComplete

            let globalProgress = {
                notStarted: globalProgressNotStarted,
                inProgress: globalComplete,
                complete: globalInProgress
            }
            let notStartedByLevel = [];
            let inProgressByLevel = [];
            let completeByLevel = [];

            Object.values(levels).map(async l =>{
                let inProgress = globalInProgressStudents.filter(x => x.inProgressTab.includes(l.id) || x.completeTab.includes(l.id));
                let complete = globalCompleteStudents.filter(x=> x.completeTab.includes(l.id));
                let inP = inProgress.length;
                let cplt = complete.length;
                let nS = students.length - (inP+cplt);
                inProgressByLevel.push(((inP/students.length)*100));
                completeByLevel.push(((cplt/students.length)*100));
                notStartedByLevel.push(((nS/students.length)*100));
            })
            let seriesByLevel = {
                notStarted: notStartedByLevel,
                inProgress: inProgressByLevel,
                complete: completeByLevel
            }
            let progressByLevel = {
                xAxis: levels.map(l => l.name),
                series: seriesByLevel
            }
            let statsGlobal = {
                nbStudent: students.length,
                nbGamePlayed: myStudentsStats.length,
                nbLevels: levels.length,
                globalProgress,
                progressByLevel
            }
            res.json(statsGlobal);
        } catch (err) {
            console.log(err);
        }
    }


    static async statsByLevel(req, res, next) {
        try {
            let levels = await levelService.getAll();
            levels = await Promise.all(levels.map(async entry => {
                const students = await profService.ladder(req.user).map(user => user.id);
                const history = await entry
                    .getUtilisateurs({ where: { id: students}, attributes: ['id', 'nom', 'prenom'] })
                    .filter(h => h.Stats.status === 'success');
                return {
                    level: entry,
                    stats: {
                        algoTime: statService.calculateStat(history, 'algoTime'),
                        totalTime: statService.calculateStat(history, 'totalTime'),
                    },
                };
            }));
            res.json(levels);

        } catch (err) {
            console.log(err);
        }
    }

}
