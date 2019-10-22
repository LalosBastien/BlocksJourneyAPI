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
        return user.prenom.substring(0, 2).toLowerCase() +
            user.nom.substring(0, 2).toLowerCase() +
            user.id;
    }

    /**
     * Generate login for auto-registered student
     * @param {Object} professor
     * @param {Object} student
     *
     * @return {string} Student login
     */
    async generateStudentLogin(professor, student) {
        const studentList = await professor.getStudents();
        const id = studentList.length + 1;
        const login = `${this.buildProfId(professor)}${student.prenom.substring(0, 5).toLowerCase()}${id}`;
        return login;
    }
}
