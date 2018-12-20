import Joi from 'joi';

const getAll = Joi.object().keys({
});

const findById = Joi.object().keys({
    params: {
        id: Joi.number().integer(),
    },
});

const update = Joi.object().keys({
    params: {
        id: Joi.number().integer(),
    },
    body: Joi.object().keys({
        nom: Joi.string(),
        prenom: Joi.string(),
        login: Joi.string(),
        password: Joi.string(),
        oldPassword: Joi.string(),
        email: Joi.string(),
        rue: Joi.string(),
        CP: Joi.string(),
        ville: Joi.string(),
    }).or('nom', 'prenom', 'login', 'password', 'email', 'rue', 'CP', 'ville')
        .and('password', 'oldPassword'),
});

const remove = Joi.object().keys({
    params: {
        id: Joi.number().integer(),
    },
});

export { getAll, findById, update, remove };
