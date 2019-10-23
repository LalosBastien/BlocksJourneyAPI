import { profService } from '../../lib/services';

describe('ProfService', () => {
    const userToTest = {
        login: 'testprof',
        password: 'cecinestpasunmdp',
        nom: 'Juste',
        prenom: 'LeProf',
        email: 'juste.LeProf@gmail.com',
        rue: '1337, rue du test',
        CP: 75000,
        ville: 'Paname',
        roleId: 2,
        students: [{
            login: 'testetudiant',
            password: 'cecinestpasunmdp',
            nom: 'Juste',
            prenom: 'Letudiant',
            email: 'juste.LeProf@gmail.com',
            rue: '1337, rue du test',
            CP: 75000,
            ville: 'Paname',
            roleId: 1,
        }]
    }; 
    describe('students',()=>{
        const mockFunction = jest.fn(function(){
            let students = null;
            if(this.students) students = this.students;
            return Promise.resolve(students);
        });
        Object.prototype.getStudents = mockFunction;

        test('Should return the list of students associated with a user',async ()=> {
            const promise = profService.students(userToTest);
            expect(promise.then).toBeDefined();
            const students = await promise;
            expect(students).toBeDefined();
            expect(students).toEqual(userToTest.students);
        })
    })
})