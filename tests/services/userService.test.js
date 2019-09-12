import { userService } from '../../lib/services';
import sequelize from '../../lib/middlewares/db.middleware';



describe('UserService', () => {
    afterAll(() => {
        sequelize.close();
    });
    let IdToTest;
    const userToTest = {
        login: 'test',
        password: 'cecinestpasunmdp',
        nom: 'Juste',
        prenom: 'LeTest',
        email: 'juste.letest@gmail.com',
        rue: '1337, rue du test',
        CP: 75000,
        ville: 'Paname',
        roleId: 1,
    };
    describe('Create', () => {
        test('Should return the same user information with generatedId', async () => {

            const u = await userService.create(userToTest);
            if (u && u.id != null) IdToTest = u.id;
            expect(IdToTest).toBeDefined();
            expect(u.login).toEqual(userToTest.login);
            expect(u.password).toEqual(userToTest.password);
            expect(u.nom).toEqual(userToTest.nom);
            expect(u.prenom).toEqual(userToTest.prenom);
            expect(u.email).toEqual(userToTest.email);
            expect(u.rue).toEqual(userToTest.rue);
            expect(u.CP).toEqual(userToTest.CP);
            expect(u.roleId).toEqual(userToTest.roleId);
        });
    })

    describe('FindById', () => {

        test('Should return the user created previously ', async () => {
            const u = await userService.findById(IdToTest);
            expect(u).not.toEqual(null);
        });
        test('Should return null cause user with this id does not exist', async () => {
            const notU = await userService.findById(16567634);
            expect(notU).toEqual(null);
        });
        test('Should return the user created previously ', async () => {
            const u = await userService.findById(IdToTest,['id']);
            expect(u).not.toEqual(null);
            expect(Object.keys(u.dataValues).length).toEqual(2);
            expect(u.dataValues.hasOwnProperty('id')).toBeTruthy()
            expect(u.dataValues.hasOwnProperty('role')).toBeTruthy()
            expect(u.dataValues.hasOwnProperty('login')).toBeFalsy()
        });
    })
    describe('findByEmail',()=>{
        test('Should return the user created previously ', async () => {
            const u = await userService.findByEmail(userToTest.email);
            expect(u).not.toEqual(null);
        });
        test('Should return null cause user with this email does not exist', async () => {
            const notU = await userService.findByEmail('idont@exist');
            expect(notU).toEqual(null);
        });
        test('Should return the user created previously ', async () => {
            const u = await userService.findByEmail(userToTest.email,['email']);
            expect(u).not.toEqual(null);
            expect(Object.keys(u.dataValues).length).toEqual(2);
            expect(u.dataValues.hasOwnProperty('email')).toBeTruthy()
            expect(u.dataValues.hasOwnProperty('role')).toBeTruthy()
            expect(u.dataValues.hasOwnProperty('login')).toBeFalsy()
        });
    })
    describe('findByLogin',()=>{
        test('Should return the user created previously ', async () => {
            const u = await userService.findByLogin(userToTest.login);
            expect(u).not.toEqual(null);
        });
        test('Should return null cause user with this login does not exist', async () => {
            const notU = await userService.findByLogin('notauser');
            expect(notU).toEqual(null);
        });
        test('Should return the user created previously ', async () => {
            const u = await userService.findByLogin(userToTest.login,['login']);
            expect(u).not.toEqual(null);
            expect(Object.keys(u.dataValues).length).toEqual(2);
            expect(u.dataValues.hasOwnProperty('login')).toBeTruthy()
            expect(u.dataValues.hasOwnProperty('role')).toBeTruthy()
            expect(u.dataValues.hasOwnProperty('id')).toBeFalsy()
        });
    })

    describe('VerifToken', () => {
        let currentVerifToken;
        describe('setVerifToken', () => {
            test('Should set verifToken on specified user', async () => {
                const svt = await userService.setVerifToken(IdToTest);
                expect(svt).toEqual([1])
                const u = await userService.findById(IdToTest);
                expect(u.verifToken).not.toEqual(null);
                currentVerifToken = u.verifToken;
            });
        })
        describe('findByVerifToken', () => {
            test('Should return the user with IdToTest', async () => {
                let u = await userService.findByVerifToken(currentVerifToken);
                expect(u.id).toEqual(IdToTest);
                expect(u.login).toEqual(userToTest.login);
                expect(u.password).toEqual(userToTest.password);
                expect(u.nom).toEqual(userToTest.nom);
                expect(u.prenom).toEqual(userToTest.prenom);
                expect(u.email).toEqual(userToTest.email);
                expect(u.rue).toEqual(userToTest.rue);
                expect(u.CP).toEqual(userToTest.CP);
                expect(u.verifToken).toEqual(currentVerifToken);
                expect(u.roleId).toEqual(userToTest.roleId);
            })
            test('Should only return id and role',async ()=>{
            let u = await userService.findByVerifToken(currentVerifToken,['id']);
            expect(u).not.toEqual(null);
            expect(Object.keys(u.dataValues).length).toEqual(2);
            expect(u.dataValues.hasOwnProperty('id')).toBeTruthy()
            expect(u.dataValues.hasOwnProperty('role')).toBeTruthy()
            expect(u.dataValues.hasOwnProperty('login')).toBeFalsy()
            })
        })
        describe('unsetVerifToken', () => {
            test('Should unset verifToken on specified user', async () => {
                const usvt = await userService.unsetVerifToken(IdToTest)
                expect(usvt).toEqual([1]);
                const u = await userService.findById(IdToTest);
                expect(u.verifToken).toEqual(null);
            });
        })
    })
    describe('UpdatePassword',()=>{
        test('Should set new password for test user',async()=>{
            let newpassword = 'ceciestunnouveaumdp';
            let update = await userService.updatePassword(IdToTest,newpassword);
            expect(update).toEqual([1]);
            const u = await userService.findById(IdToTest);
            expect(u.password).toEqual(newpassword);
        })
    })
});