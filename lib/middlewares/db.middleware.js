import Sequelize from 'sequelize';
import { dbType, dbHost, dbPort, dbSchema, dbPool, dbUsername, dbPassword } from './../../config/localdb.config.json';

const dbOptions = {
    host: process.env.DATABASE_HOST || dbHost,
    port: process.env.DATABASE_PORT || dbPort,
    dialect: process.env.DATABASE_TYPE || dbType,
    operatorsAliases: false,
    pool: dbPool,
    logging:false
};

const sequelize = new Sequelize(
        process.env.DATABASE_SCHEMA || dbSchema, 
        process.env.DATABASE_USER || dbUsername, 
        process.env.DATABASE_PASSWORD || dbPassword, 
        dbOptions
    );

export default sequelize;
