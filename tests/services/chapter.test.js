import { chapterService } from '../../lib/services';

describe('ChapterService', () => {
    describe('getAllWithLevels',()=>{
        const chapters = [{}];
        const mockFunction = jest.fn(()=>{
            return Promise.resolve([]);
        })
        chapterService.model.findAll =mockFunction;
        test('Should return all chapter with levels associated',async()=>{
            let promise = chapterService.getAllWithLevels();
            expect(promise.then).toBeDefined();
            let chapters = await promise;
            expect(chapters).toBeDefined();
        })
    })
})