import Joi from 'joi';

const accept = Joi.object().keys({
    params: {
        profId: Joi.number().integer(),
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

const addStudents = Joi.object().keys({
    body: Joi.array().required().items({
        firstname: Joi.string(),
        name: Joi.string(),
    })
})

const renewStudent = Joi.object().keys({
    body: Joi.array().required().items(Joi.number().integer())
});

export {
    accept,
    invite,
    addStudents,
    renewStudent
};