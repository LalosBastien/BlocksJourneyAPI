import rTokenGenerator from 'random-token';

const generateAccessToken = () => rTokenGenerator(18);
const generateResetToken = () => rTokenGenerator(16);

export { generateAccessToken, generateResetToken };

