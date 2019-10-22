import Service from './service';
import ObjectifModel from '../models/objectif.model';
import ObjectifMappingModel from '../models/objectifMapping.model';

class ObjectifMappingService extends Service {
    constructor() {
        super(ObjectifMappingModel);
    }

    async findByIdLevel(idLevel) {
        return this.findArrayByField('LevelId', idLevel);
    }
}


export default class ObjectifService extends Service {
    constructor() {
        super(ObjectifModel);
        this.mappingService = new ObjectifMappingService();
    }

    async findByIdLevel(idLevel) {
        const mapping = await this.mappingService.findByIdLevel(idLevel);
        return Promise.all(mapping.map(async (current) => {
            const objectif = await this.findById(current.objectifId);
            return {
                ...objectif.dataValues,
                goal: current.goal,
            };
        }));
    }
}

