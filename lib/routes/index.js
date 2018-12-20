import authenticationRouter from './authentication.route';
import userRouter from './users.route';
import levelRouter from './level.route';
import profRouter from './prof.route';
import documentationRouter from './documentation.route';
import roleRouter from './role.route';

export default (app) => {
    app.use(authenticationRouter);
    app.use('/users', userRouter);
    app.use('/levels', levelRouter);
    app.use('/prof', profRouter);
    app.use('/documentation', documentationRouter);
    app.use('/roles', roleRouter);
};
