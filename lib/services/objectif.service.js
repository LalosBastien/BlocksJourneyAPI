import Service from './service';
import ObjectifModel from '../models/objectif.model';
import ObjectifMappingModel from '../models/objectifMapping.model';

class ObjectifMappingService extends Service {
    constructor(){
        super(ObjectifMappingModel);
    }

    async findByIdLevel(idLevel){
        return await this.findArrayByField('LevelId',idLevel);
    }
}


export default class ObjectifService extends Service {
    constructor() {
        super(ObjectifModel);
        this.mappingService = new ObjectifMappingService();
    }

    async findByIdLevel(idLevel){
        const mapping = await this.mappingService.findByIdLevel(idLevel)
        let objectifs = [];
        for(let current of mapping){
            let objectif = await this.findById(current.objectifId);
            if(objectif){
                objectif = {
                    ...JSON.parse(JSON.stringify(objectif)),
                    goal: current.goal
                }
                objectifs.push(objectif);
            }
        }
        return objectifs;
    }

}

