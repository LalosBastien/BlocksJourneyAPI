import Service from './service';
import RoleModel from '../models/role.model';

export default class RoleService extends Service {
    constructor() {
        super(RoleModel);
    }
}
