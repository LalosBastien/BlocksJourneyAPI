import getTypedProperties from './models.module';
import sequelize from '../middlewares/db.middleware';
import { UserStructure } from './structures';
import Role from './role.model';

const User = sequelize.define(UserStructure.name, getTypedProperties(UserStructure), {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

User.belongsToMany(User, { as: 'students', foreignKey: 'profId', through: 'Students' });
User.belongsToMany(User, { as: 'profs', foreignKey: 'studentId', through: 'Students' });
User.belongsTo(Role, { as: 'role', foreignKey: 'roleId' });

export default User;
