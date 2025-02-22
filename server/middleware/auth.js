import jwt from 'jsonwebtoken';

const auth = async (request, response, next) => {
  try {
    const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1] // Corrected token extraction

    if (!token) {
      return response.status(401).json({
        message: 'Provide token',
      });
    }

    const decode =await jwt.verify(
      token,
      process.env.SECRET_KEY_ACCESS_TOKEN
    );
    
    

    if (!decode) {
      return response.status(401).json({
        message: 'Unauthorized access',
        error: true,
        success: false,
      });
    }

    request.userId = decode.id;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return response.status(401).json({
        message: 'Token expired. Please log in again.',
        error: true,
        success: false,
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return response.status(401).json({
        message: 'Invalid token.',
        error: true,
        success: false,
      });
    } else {
      console.error('Authentication error:', error); // Log the error
      return response.status(500).json({
        message: error.message || 'Authentication error.',
        error: true,
        success: false,
      });
    }
  }
};

export default auth;