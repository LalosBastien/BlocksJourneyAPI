import getProperties from '../../lib/models/models.module';
import userModel from '../../lib/models/user.model';
const Sequelize = require('sequelize');

const userStructure = require('./user.structure.json');
const brokenUserModel = require('./brokenUser.structure.json');

describe('== Models', () => {
    it('should load correctly the properties', () => {
        const properties = getProperties(userStructure);
        expect(properties.id.type).toBe(Sequelize.INTEGER);
    });

    it('should load a sequelize instance', () => {
        expect(userModel instanceof Function).toBeTruthy();
        expect(userModel.create instanceof Function).toBeTruthy();
    });

    it('should throw an error for invalid types', () => {
        expect(() => { getProperties(brokenUserModel); })
            .toThrow(new Error('Unknown sequelize type'));
    });
});
