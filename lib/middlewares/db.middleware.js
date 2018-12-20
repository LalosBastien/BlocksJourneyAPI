import Sequelize from 'sequelize';
import { dbType, dbHost, dbPort, dbSchema, dbPool, dbUsername, dbPassword } from './../../config/localdb.config.json';

const dbOptions = {
    host: dbHost,
    port: dbPort,
    dialect: dbType,
    operatorsAliases: false,
    pool: dbPool,
    logging:false
};

const sequelize = new Sequelize(dbSchema, dbUsername, dbPassword, dbOptions);

export default sequelize;
