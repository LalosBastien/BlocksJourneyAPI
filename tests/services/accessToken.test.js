import { atService } from '../../lib/services';

const dateImpl = global.Date;
describe('AccessTokenService', () => {
    describe('findLastByIdUser', () => {
        test('Should find last token by user id', async () => {
            const mockFunction = jest.fn();
            atService.model.findOne = mockFunction;

            await atService.findLastByIdUser(1);

            expect(mockFunction.mock.calls.length).toBe(1);
            const paramPassed = mockFunction.mock.calls[0][0];
            expect(typeof paramPassed).toBe('object');
            expect(Object.keys(paramPassed).length).toBe(2);
            expect(paramPassed.where).toBeDefined();
            expect(paramPassed.where.id).toBeDefined();
            expect(paramPassed.where.id).toBe(1);
            expect(paramPassed.order).toBeDefined();
            expect(paramPassed.order).toEqual([['expireDate', 'DESC']]);
        });
    });

    describe('findLastByIdUser', () => {
        test('Should create a valid token', async () => {
            global.Date = dateImpl;
            const mockFunction = jest.fn(() => Promise.resolve());
            atService.create = mockFunction;
            const expectedDate = new Date('2019-09-11T09:03:42.233Z');
            const mockDate = new Date('2019-09-10T09:03:42.233Z');
            global.Date = jest.fn(() => mockDate)

            const promise = atService.createToken(1);
            expect(promise.then).toBeDefined();
            await promise;
            const paramPassed = mockFunction.mock.calls[0][0];

            expect(mockFunction.mock.calls.length).toBe(1);
            expect(typeof paramPassed).toBe('object');
            expect(Object.keys(paramPassed).length).toBe(3);
            expect(paramPassed.idUtilisateur).toBeDefined();
            expect(paramPassed.idUtilisateur).toBe(1);
            expect(paramPassed.expireDate).toBeDefined();
            expect(paramPassed.expireDate).toEqual(expectedDate);
            expect(paramPassed.token).toBeDefined();
            expect(typeof paramPassed.token).toEqual('string');
            expect(paramPassed.token.length).toBe(18);
        });
    });
    describe('isTokenValid', () => {
        test('Should return true for valid token', async () => {
            global.Date = dateImpl;
            const mockToken = {
                expireDate: new Date('2019-09-12T09:03:42.233Z'),
                idUtilisateur: 1,
            };
            const mockFunction = jest.fn(() => Promise.resolve(mockToken));
            atService.findByField = mockFunction;
            const mockDate = new Date('2019-09-10T09:03:42.233Z');
            global.Date = jest.fn(() => mockDate);

            const promise = atService.isTokenValid();
            expect(promise.then).toBeDefined();
            const isValid = await promise;


            expect(isValid).toBe(1);
        });

        test('Should return false for an outdated token', async () => {
            global.Date = dateImpl;
            const mockToken = {
                expireDate: new Date('2019-09-08T09:03:42.233Z')
            };
            const mockFunction = jest.fn(() => Promise.resolve(mockToken));
            atService.findByField = mockFunction;
            const mockDate = new Date('2019-09-10T09:03:42.233Z');
            global.Date = jest.fn(() => mockDate)

            const promise = atService.isTokenValid();
            expect(promise.then).toBeDefined();
            const isValid = await promise;


            expect(isValid).toBeFalsy();
        });

        test('Should return false when no token is found', async () => {
            global.Date = dateImpl;
            const mockFunction = jest.fn(() => Promise.resolve(null));
            atService.findByField = mockFunction;
            const mockDate = new Date('2019-09-10T09:03:42.233Z');
            global.Date = jest.fn(() => mockDate)

            const promise = atService.isTokenValid();
            expect(promise.then).toBeDefined();
            const isValid = await promise;


            expect(isValid).toBeFalsy();
        });
    });
});
