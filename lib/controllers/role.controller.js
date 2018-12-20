import status from 'http-status';
import { roleService } from '../services';

export default class RoleController {
    // eslint-disable-next-line consistent-return
    static async getAll(req, res, next) {
        try {
            const list = await roleService.getAll();
            return res.status(status.OK).json({ message: 'Success', list });
        } catch (err) {
            return res.status(status.UNAUTHORIZED).json(err.message);
        }
    }
    // eslint-disable-next-line consistent-return
    static async findById(req, res, next) {
        try {
            const role = await roleService.findById(req.params.id);
            res.status(status.OK).json(role);
        } catch (err) {
            next(err);
        }
    }
    // eslint-disable-next-line consistent-return
    static async update(req, res, next) {
        try {
            if ((await roleService.update(req.params.id, req.body))[0] > 0) {
                return res.status(status.OK).json({ message: 'Role updated successfully' });
            }
            return res.status(status.NOT_FOUND).json({ message: 'Role did not update' });
        } catch (err) {
            next(err);
        }
        return Promise.resolve();
    }
    // eslint-disable-next-line consistent-return
    static async delete(req, res, next) {
        try {
            await roleService.delete(req.params.id);
            res.json({ message: 'Role deleted successfully' });
        } catch (err) {
            next(err);
        }
    }
}
