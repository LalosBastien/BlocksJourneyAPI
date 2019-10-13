import rTokenGenerator from 'random-token';

const generateAccessToken = () => rTokenGenerator(18);
const generateResetToken = () => rTokenGenerator(16);
const generatePasswordToken = () => rTokenGenerator(8);

export { generateAccessToken, generateResetToken, generatePasswordToken };

