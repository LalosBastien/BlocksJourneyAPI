import UserService from './user.service';
import LevelService from './level.service';
import ProfService from './prof.service';
import RoleService from './role.service';
import AccessTokenService from './accessToken.service';
import StatService from './stats.service';
import ChapterService from './chapter.service';
import ObjectifService from './objectif.service';

// service instances
const userService = new UserService();
const levelService = new LevelService();
const profService = new ProfService();
const atService = new AccessTokenService();
const roleService = new RoleService();
const statService = new StatService();
const chapterService = new ChapterService();
const objectifService = new ObjectifService();

export { userService, atService, levelService, profService, roleService, statService, chapterService,objectifService };