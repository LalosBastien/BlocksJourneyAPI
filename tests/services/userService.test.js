import { userService } from '../../lib/services';
import sequelize from '../../lib/middlewares/db.middleware';
let IdToTest;

afterAll(() => {
    sequelize.close();
});

test('UserService : Create', async () => {
    const user = {
        login: 'test',
        password: 'cecinestpasunmdp',
        nom: 'Juste',
        prenom: 'LeTest',
        email: 'juste.letest@gmail.com',
        rue: '1337, rue du test',
        CP: '75000',
        ville: 'Paname',
        roleId: 1,
    };
    const u = await userService.create(user);
    if (u && u.id != null) IdToTest = u.id;
    expect(IdToTest).toBeDefined();
    expect(u.login).toEqual('test');
    expect(u.password).toEqual('cecinestpasunmdp');
    expect(u.nom).toEqual('Juste');
    expect(u.prenom).toEqual('LeTest');
    expect(u.email).toEqual('juste.letest@gmail.com');
    expect(u.rue).toEqual('1337, rue du test');
    expect(u.CP).toEqual('75000');
    expect(u.roleId).toEqual(1);
});


test('UserService: FindById', async () => {
    const u = await userService.findById(IdToTest);
    expect(u).not.toEqual(null);
    const notU = await userService.findById(16567634);
    expect(notU).toEqual(null);
});

test('UserService : setVerifToken', async () => {
    const svt = await userService.setVerifToken(IdToTest);
    expect(svt).toEqual([1])
    const u = await userService.findById(IdToTest);
    expect(u.verifToken).not.toEqual(null);
});

test('UserService: unsetVerifToken', async () => {
    const usvt = await userService.unsetVerifToken(IdToTest)
    expect(usvt).toEqual([1]);
    const u = await userService.findById(IdToTest);
    expect(u.verifToken).toEqual(null);
});

