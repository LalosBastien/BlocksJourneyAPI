export default requiredLevel => async (req, res, next) => {
    if (req.user.role.dataValues.accessLevel >= requiredLevel) {
        return next();
    }
    return next({ code: 403, message: 'Vous avez été deconnecté après avoir tenté une action non autorisé par votre role.'});
};
