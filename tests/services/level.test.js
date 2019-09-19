import { levelService } from '../../lib/services';
import StatsModel from '../../lib/models/stats.model'
describe('levelService', () => {
    const entities = [];
    const levels = [];
    describe('createStats', () => {
        const mockFunction = jest.fn((param) => {
            let newId = Math.floor(Math.random() * (155 - 1) + 1);
            let newEntity = { id: newId, ...param };
            entities.push(newEntity);
            return Promise.resolve(newEntity)
        });
        StatsModel.create = mockFunction;
        test('Should return a new stat line for the user id 1', async () => {
            let promise = levelService.createStats({ id: 1 }, { id: 1 });
            expect(promise.then).toBeDefined();
            let newStat = await promise;
            expect(newStat).toBeDefined();
            expect(entities.includes(newStat)).toBeTruthy();
            expect(newStat.levelId).toBeDefined();
            expect(newStat.levelId).toEqual(1);
            expect(newStat.userId).toBeDefined();
            expect(newStat.userId).toEqual(1);
            expect(newStat.status).toBeDefined();
            expect(newStat.status).toEqual('in_progress');
            expect(newStat.tryNumber).toBeDefined();
            expect(newStat.tryNumber).toEqual(0);

        })
    })
    describe('validateLevels', () => {
        const mockFunction = jest.fn((param) => {
            let newId = Math.floor(Math.random() * (155 - 1) + 1);
            let newEntity = { id: newId, ...param };
            entities.push(newEntity);
            return Promise.resolve(newEntity)
        });
        StatsModel.create = mockFunction;
        const getLevels = jest.fn(function(){
            return this.levels;
        });
        Object.prototype.getLevels = getLevels;
        Object.prototype.save = Promise.resolve([1]);
        test('Should validate level status', async () => {
            let promise = levelService.validateLevel(
                { id: 1 },
                { id: 1,levels:[{id:1,dataValues:{Stats:[]}}] },
                {status:'failed', algoTime:4, energyConsumed:250, stars:2}
                );
            let newStat = await promise;


        })
    })
    describe('getLEvelsWitHistory',()=>{
        const mockFunction = jest.fn(()=>Promise.resolve([]));
        levelService.model.findAll = mockFunction;
        test('Should return lvels with Users',()=>{
            let promise = levelService.getLevelsWithHistory();
            expect(promise.then).toBeDefined();
        })
    })
    describe('findHistoryOf',()=>{
        test('Should return history of user',()=>{
            let promise = levelService.findHistoryOf({levels:[]})
            expect(promise.then).toBeDefined();
        })
    })
})