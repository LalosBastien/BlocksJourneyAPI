import { userService } from '../../lib/services';
import sequelize from '../../lib/middlewares/db.middleware';



describe('UserService', () => {
    let users = [];
    let idToTest;
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
        test('Should create user with provided information + generatedId', async () => {
            let newId = 125;
            const mockFunction = jest.fn((param) => { 
                let newUser = {id:newId,...param,verifToken:null};
                users.push(newUser);
                return Promise.resolve(newUser)
            });
            userService.model.create = mockFunction;

            const promise = userService.create(userToTest);
            expect(promise.then).toBeDefined();
            let u = await promise;

            const paramPassed = mockFunction.mock.calls[0][0];
            expect(mockFunction.mock.calls.length).toBe(1);            
            expect(typeof paramPassed).toBe('object');
            expect(Object.keys(paramPassed).length).toBe(9);
            expect(paramPassed.login).toBeDefined();
            expect(paramPassed.password).toBeDefined();
            expect(paramPassed.nom).toBeDefined();
            expect(paramPassed.prenom).toBeDefined();
            expect(paramPassed.email).toBeDefined();
            expect(paramPassed.rue).toBeDefined();
            expect(paramPassed.CP).toBeDefined();
            expect(paramPassed.roleId).toBeDefined();


            if (u && u.id != null) idToTest = u.id;
            expect(idToTest).toBeDefined();
            expect(idToTest).toEqual(newId);
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
        const mockFunction = jest.fn((filtre) => { 
            let modelFindOne = users.filter(x =>{
                let pass = true;
                for(let key of Object.keys(filtre.where)){
                  if(x[key] != filtre.where[key]) pass = false;
                }
                return pass;
            })
            if(modelFindOne.length == 0 ) return null;
            let found = {}
            if(filtre.attributes && filtre.attributes){
                for(let key of filtre.attributes){
                    found[key] = modelFindOne[key]
                }
            }else{
                found = {...modelFindOne[0]}
            }
            found.role = {id:1,name:"Etudiant",accessLevel:1 }

            return Promise.resolve(found);
        });
        userService.model.findOne = mockFunction;
        test('Should return the user created previously ', async () => {
            const u = await userService.findById(idToTest);
            expect(u).not.toEqual(null);
        });
        test('Should return null cause user with this id does not exist', async () => {
            const notU = await userService.findById(16567634);
            expect(notU).toEqual(null);
        });
        test('Should return the user created previously ', async () => {
            const u = await userService.findById(idToTest,['id']);
            expect(u).not.toEqual(null);
            expect(Object.keys(u).length).toEqual(2);
            expect(u.hasOwnProperty('id')).toBeTruthy()
            expect(u.hasOwnProperty('role')).toBeTruthy()
            expect(u.hasOwnProperty('login')).toBeFalsy()
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
            expect(Object.keys(u).length).toEqual(2);
            expect(u.hasOwnProperty('email')).toBeTruthy()
            expect(u.hasOwnProperty('role')).toBeTruthy()
            expect(u.hasOwnProperty('login')).toBeFalsy()
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
            expect(Object.keys(u).length).toEqual(2);
            expect(u.hasOwnProperty('login')).toBeTruthy()
            expect(u.hasOwnProperty('role')).toBeTruthy()
            expect(u.hasOwnProperty('id')).toBeFalsy()
        });
    })

    describe('VerifToken', () => {
        let currentVerifToken;
        const mockFunction = jest.fn((fields,filtre) => { 
            let modelUpdate = users.filter(x =>{
                let pass = true;
                for(let key of Object.keys(filtre.where)){
                  if(x[key] != filtre.where[key]) pass = false;
                }
                return pass;
            })
            if(modelUpdate.length == 0) return Promise.resolve([0]);
            for(let x of modelUpdate){
                for(let key of Object.keys(fields)){
                    x[key] = fields[key];
                }
            }
            return Promise.resolve([1]);
        });
        userService.model.update = mockFunction;
        describe('setVerifToken', () => {
            test('Should set verifToken on specified user', async () => {
                const svt = await userService.setVerifToken(idToTest);
                expect(svt).toEqual([1])
                const u = await userService.findById(idToTest);
                expect(u.verifToken).not.toEqual(null);
                currentVerifToken = u.verifToken;
            });
        })
        describe('findByVerifToken', () => {
            test('Should return the user with idToTest', async () => {
                let u = await userService.findByVerifToken(currentVerifToken);
                expect(u.id).toEqual(idToTest);
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
            expect(Object.keys(u).length).toEqual(2);
            expect(u.hasOwnProperty('id')).toBeTruthy()
            expect(u.hasOwnProperty('role')).toBeTruthy()
            expect(u.hasOwnProperty('login')).toBeFalsy()
            })
        })
        describe('unsetVerifToken', () => {
            test('Should unset verifToken on specified user', async () => {
                const usvt = await userService.unsetVerifToken(idToTest)
                expect(usvt).toEqual([1]);
                const u = await userService.findById(idToTest);
                expect(u.verifToken).toEqual(null);
            });
        })
    })
    describe('UpdatePassword',()=>{
        test('Should set new password for test user',async()=>{
            let newpassword = 'ceciestunnouveaumdp';
            const promise = userService.updatePassword(idToTest,newpassword);
            expect(promise.then).toBeDefined();
            let update = await promise;
            expect(update).toEqual([1]);
            const u = await userService.findById(idToTest);
            expect(u.password).toEqual(newpassword);
        })
    })
});
