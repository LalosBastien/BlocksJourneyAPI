import {statService} from '../../lib/services';

describe('statService',()=>{
    let entities = [{userId:'1'}];
    describe('globalHistory',()=>{
        const mockFunction = jest.fn((filtre) => {
            let modelFindAll = entities.filter(x => {
                let pass = true;
                if (filtre && filtre.where) {
                    for (let key of Object.keys(filtre.where)) {
                        if (x[key] != filtre.where[key]) pass = false;
                    }
                }
                return pass;
            });
            if (modelFindAll.length == 0) return null;
            let all = [];
            for (let entity of modelFindAll) {
                let found = {}
                if (filtre && filtre.attributes && filtre.attributes) {
                    for (let key of filtre.attributes) {
                        found[key] = entity[key]
                    }
                } else {
                    found = { ...entity }
                }
                all.push(found)
            }
            return Promise.resolve(all);
        });
        statService.model.findAll = mockFunction;
        test('Should  return all stats history',async()=>{
        const promise = statService.globalHistory()
        expect(promise.then).toBeDefined();

        });
    });
    describe('historyByUser',()=>{
        test('Should stats history for user',async()=>{
            const promise = statService.historyByUser(1);
            expect(promise.then).toBeDefined();
        });
    });
    describe('calculateStat',()=>{
        test('Should return best worst average',()=>{
            let calcul = statService.calculateStat([], 'key');
            expect(calcul).toBeDefined();
            expect(calcul).toEqual({
                best:'none',
                worst: 'none',
                average: 'none',
            });
        });     
    });
});