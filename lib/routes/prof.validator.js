import Joi from 'joi';

const ladder = Joi.object().keys({
    params: {
        id: Joi.number().integer(),
    },
});

const invite = Joi.object().keys({
    params: {
        id: Joi.number().integer(),
    },
    body: Joi.object().keys({
        emails: Joi.array().items(Joi.string()),
    }),
});

const accept = Joi.object().keys({
    params: {
        profId: Joi.number().integer(),
    },
});

export { ladder, invite, accept };
