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
        name: Joi.string(),
        difficulty: Joi.number().min(0).max(10),
    }),
});

const remove = Joi.object().keys({
    params: {
        id: Joi.number().integer(),
    },
});

export { getAll, findById, update, remove };
