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

    buildProfId(user) {
        return user.firstname.substring(0, 2).toLower() + user.name.substring(0, 2).toLower() + user.id;
    }

    generateStudentLogin(professor, student) {
        const login = this.buildProfId(professor) + '-' + this.buildProfId(student);
        return login;
    }
}