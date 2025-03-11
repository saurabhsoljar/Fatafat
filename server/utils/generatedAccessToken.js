import jwt from 'jsonwebtoken';

const generatedAccessToken = (userId) => {
  try {
    const token = jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_ACCESS_TOKEN,
      { expiresIn: '5h' }
    );
    return token;
  } catch (error) {
    console.error('Error generating access token:', error);
    throw new Error('Failed to generate access token');
  }
};

export default generatedAccessToken;



