import Service from './service';
import StatsModel from '../models/stats.model';

export default class StatService extends Service {
    constructor() {
        super(StatsModel);
    }

    globalHistory() {
        return this.getAll().map(x => x.dataValues);
    }
    historyByUser(id) {
        return this.findArrayByField('userId', id);
    }

    calculateStat(history, statName) {
        let best = history
            .reduce((prev, current) => ((prev.Stats[statName] < current.Stats[statName]) ? prev : current), history[0]);
        if (best) {
            best = best.get({ plain: true });
            best.Stats = { id: best.Stats.id, value: best.Stats[statName] };
        }
        let worst = history
            .reduce((prev, current) => ((prev.Stats[statName] > current.Stats[statName]) ? prev : current), history[0]);
        if (worst) {
            worst = worst.get({ plain: true });
            worst.Stats = { id: worst.Stats.id, value: worst.Stats[statName] };
        }

        let average = history.reduce((sum, c) => sum + c.Stats[statName], 0);
        if (history.length > 0) {
            average /= history.length;
        }
        return {
            best: best || 'none',
            worst: worst || 'none',
            average: average || 'none',
        };
    }
}
