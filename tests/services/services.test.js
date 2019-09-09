import { userService, levelService, profService, roleService, atService, statService, chapterService, objectifService } from '../../lib/services';

test('[SUCCESS] instanciate services', () => {
    expect(userService).toBeDefined();
    expect(levelService).toBeDefined();
    expect(profService).toBeDefined();
    expect(atService).toBeDefined();
    expect(roleService).toBeDefined();
    expect(statService).toBeDefined();
    expect(chapterService).toBeDefined();
    expect(objectifService).toBeDefined();
});