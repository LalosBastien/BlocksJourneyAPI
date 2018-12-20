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
    ladder(user) {
        return user.getStudents();
    }
}
