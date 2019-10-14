import Service from './service';
import UserModel from '../models/user.model';

export default class ProfService extends Service {
    constructor() {
        super(UserModel);
    }

    /**
     * List of the students
     * @param  {Object} user
     * @return {Array} Sequelize Array
     */
    students(user) {
        return user.getStudents();
    }

    /**
     * 
     * @param {UserModel} user 
     */
    buildProfId(user) {
        return user.prenom.substring(0, 2).toLower() + user.nom.substring(0, 2).toLower() + user.id;
    }

    /**
     * Generate login for auto-registered student
     * @param {Object} professor
     * @param {Object} student
     * 
     * @return {string} Student login
     */
    generateStudentLogin(professor, student) {
        const studentsCount = professor.getStudents().length;
        const login = this.buildProfId(professor) + '-' + student.prenom.substring(0, 5) + studentsCount;
        return login;
    }
}