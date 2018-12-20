import bcrypt from 'bcrypt';

const hashPassword = async (clearPass) => {
    try {
        const iteration = 10;
        const salt = await bcrypt.genSalt(iteration);
        return bcrypt.hash(clearPass, salt);
    }
    catch (error) {
        return Promise.reject(error);
    }
};

const doesPasswordMatch = async (password, userHash) => bcrypt.compare(password, userHash);

export { hashPassword, doesPasswordMatch };
