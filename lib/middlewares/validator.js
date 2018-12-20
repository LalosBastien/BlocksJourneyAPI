import Joi from 'joi';
import status from 'http-status';

/**
 * The middleware that handles the route validation
 *
 * @param {Object} schema The Joi schema
 * @return {Function} Joi express middleware
 */
export default schema => (req, res, next) => {
    const result = Joi.validate(req, schema, { allowUnknown: true });

    if (result.error) {
        const error = {
            message: result.error.details.reduce((msg, detail) => `${msg}${detail.message},`, ''),
            status: status.BAD_REQUEST,
        };
        return next(error);
    }

    return next();
};
