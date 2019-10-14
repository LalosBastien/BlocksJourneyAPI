import Joi from 'joi';

const login = Joi.object().keys({
    body: {
        login: Joi.string().alphanum().min(8).max(30)
            .required(),
        password: Joi.string().min(8).required(),
    },
});

const logout = Joi.object().keys({
    query: {

    },
});

const register = Joi.object().keys({
    body: {
        login: Joi.string().alphanum().min(8).max(30)
            .required(),
        password: Joi.string().min(8).required(),
        nom: Joi.string(),
        prenom: Joi.string(),
        email: Joi.string(),
        rue: Joi.string(),
        CP: Joi.number().integer().min(5).max(5),
        ville: Joi.string(),
    },
});
const resetPassword = Joi.object().keys({
    body: {
        token: Joi.string().required(),
        password: Joi.string().min(8).required(),
    },
});
const askResetPassword = Joi.object().keys({
    query: {
        email: Joi.string().required(),
    },
});

export { login, logout, register, resetPassword, askResetPassword };
