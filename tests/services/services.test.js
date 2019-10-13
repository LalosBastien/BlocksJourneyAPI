import { userService, levelService, profService, roleService, atService, statService, chapterService, objectifService } from '../../lib/services';
import Service from '../../lib/services/service.js';
test('Instanciate services', () => {
    expect(userService).toBeDefined();
    expect(levelService).toBeDefined();
    expect(profService).toBeDefined();
    expect(atService).toBeDefined();
    expect(roleService).toBeDefined();
    expect(statService).toBeDefined();
    expect(chapterService).toBeDefined();
    expect(objectifService).toBeDefined();
});

describe('Test Service Class', () => {
    let entities = [{ id: 44571, entityField: 'v1' }, { id: 467867, entityField: 'v32' }];
    let S = new Service({});

    let idToTest;
    test('Service Instance', () => {
        expect(S).toBeDefined();
        expect(S.model).toBeDefined();
        expect(S.findById).toBeInstanceOf(Function);
        expect(S.findArrayByField).toBeInstanceOf(Function);
        expect(S.findByField).toBeInstanceOf(Function);
        expect(S.getAll).toBeInstanceOf(Function);
        expect(S.create).toBeInstanceOf(Function);
        expect(S.update).toBeInstanceOf(Function);
        expect(S.delete).toBeInstanceOf(Function);
    });
    test('create', async () => {
        const mockFunction = jest.fn((param) => {
            let newId = Math.floor(Math.random() * (155 - 1) + 1);
            let newEntity = { id: newId, ...param };
            entities.push(newEntity);
            return Promise.resolve(newEntity)
        });
        S.model.create = mockFunction;

        const promise = S.create({ entityField: 'v1' });
        expect(promise.then).toBeDefined();
        let entity = await promise;

        const paramPassed = mockFunction.mock.calls[0][0];
        expect(mockFunction.mock.calls.length).toBe(1);
        expect(typeof paramPassed).toBe('object');
        expect(Object.keys(paramPassed).length).toBe(1);
        expect(paramPassed.entityField).toBeDefined();
        expect(typeof paramPassed.entityField).toEqual('string');
        expect(paramPassed.entityField).toEqual('v1');
        expect(entity.id).toBeDefined();
        idToTest = entity.id;

    })
    describe('findById', () => {
        const mockFunction = jest.fn((filtre) => {
            let modelFindOne = entities.filter(x => {
                let pass = true;
                for (let key of Object.keys(filtre.where)) {
                    if (x[key] != filtre.where[key]) pass = false;
                }
                return pass;
            })
            if (modelFindOne.length == 0) return null;
            let found = {}
            if (filtre.attributes && filtre.attributes) {
                for (let key of filtre.attributes) {
                    found[key] = modelFindOne[0][key]
                }
            } else {
                found = { ...modelFindOne[0] }
            }
            return Promise.resolve(found);
        });
        S.model.findOne = mockFunction;
        test('Should return the entity created previously ', async () => {
            const entity = await S.findById(idToTest);
            expect(entity).not.toEqual(null);
            expect(entity.id).toBeDefined();
            expect(entity.id).toEqual(idToTest);
        });
        test('Should return the entity created previously with only entityField', async () => {
            const entity = await S.findById(idToTest, ['entityField']);
            expect(entity).not.toEqual(null);
            expect(entity.id).not.toBeDefined();
            expect(entity.entityField).toBeDefined();
            expect(entity.entityField).toEqual('v1');
        });
        test('Should return null cause entity with this id does not exist', async () => {
            const notEntity = await S.findById(16567634);
            expect(notEntity).toEqual(null);
        });
    })
    describe('getAll', () => {
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
        S.model.findAll = mockFunction;
        test('Should return all entities stored', async () => {
            const promise = S.getAll();
            expect(promise.then).toBeDefined()
            const all = await promise;
            expect(all).toEqual(entities);
        })
        test('Should return all entities stored with only the passed field', async () => {
            const promise = S.getAll(['entityField']);
            expect(promise.then).toBeDefined()
            const all = await promise;
            expect(all).toBeDefined();
            expect(all.length).toEqual(3);
            for (let entity of all) {
                expect(entity).not.toEqual(null);
                expect(entity.id).not.toBeDefined();
                expect(entity.entityField).toBeDefined();
            }
        })

    })
    describe('findArrayByField', () => {
        test('Should return all entities stored with field equal to value passed', async () => {
            const promise = S.findArrayByField('entityField', 'v1');
            expect(promise.then).toBeDefined();
            const fabf = await promise;
            expect(fabf.length).toEqual(2);
        })
        test('Should return all entities stored with field equal to value passed with only entityField', async () => {
            const promise = S.findArrayByField('entityField', 'v1', ['entityField']);
            expect(promise.then).toBeDefined();
            const fabf = await promise;
            expect(fabf.length).toEqual(2);
            for (let entity of fabf) {
                expect(entity).not.toEqual(null);
                expect(entity.id).not.toBeDefined();
                expect(entity.entityField).toBeDefined();
                expect(entity.entityField).toEqual('v1');
            }
        });
    })
    describe('findByField', () => {
        test('Should return one entity stored with field equal to value passed', async () => {
            const promise = S.findByField('entityField', 'v1')
            expect(promise.then).toBeDefined();
            const fbf = await promise;
            expect(fbf)
        })
        test('Should return one entity stored with field equal to value passed with only entityField', async () => {
            const promise = S.findByField('id', idToTest, ['entityField']);
            expect(promise.then).toBeDefined();
            const entity = await promise;
            expect(entity).not.toEqual(null);
            expect(entity.id).not.toBeDefined();
            expect(entity.entityField).toBeDefined();
            expect(entity.entityField).toEqual('v1');
        });

    })

    describe('update', () => {
        const mockFunction = jest.fn((fields, filtre) => {
            let modelUpdate = entities.filter(x => {
                let pass = true;
                for (let key of Object.keys(filtre.where)) {
                    if (x[key] != filtre.where[key]) pass = false;
                }
                return pass;
            })
            if (modelUpdate.length == 0) return Promise.resolve([0]);
            for (let x of modelUpdate) {
                for (let key of Object.keys(fields)) {
                    x[key] = fields[key];
                }
            }
            return Promise.resolve([1]);
        });
        S.model.update = mockFunction;
        test('Should update the entity corresponding to filter', async () => {
            const promise = S.update(44571, { entityField: 'v2' });
            expect(promise.then).toBeDefined()
            const update = await promise;
            expect(update).toEqual([1]);

            const entity = await S.findById(44571);
            const entity2 = await S.findById(idToTest);
            expect(entity).not.toEqual(null);
            expect(entity.entityField).toEqual('v2');
            expect(entity2.entityField).toEqual('v1');
        });
    })
    describe('delete', () => {
        const mockFunction = jest.fn(function () {
            if (!this && !this.id) return Promise.resolve([0]);
            let ind = entities.indexOf(this);
            entities.splice(ind, 1);
            return Promise.resolve([1]);
        });
        Object.prototype.destroy = mockFunction
        test('Should delete Object from entities', async () => {
            const promise = S.delete(44571);
            expect(promise.then).toBeDefined()
            const del = await promise;
            expect(del).toEqual([1]);
            expect(entities.length).toEqual(2);

        })
    })
});
