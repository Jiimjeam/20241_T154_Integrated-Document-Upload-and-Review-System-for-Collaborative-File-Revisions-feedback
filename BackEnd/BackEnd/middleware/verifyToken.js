import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    // Retrieve the token from cookies
    const token = req.cookies?.token;
    console.log('Received Token:', token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - no token provided',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debugging log

    // Set the user ID in the request object
    req.userId = decoded.userId;

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error('Error in verifyToken:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - token expired',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during token verification',
    });
  }
};

export default verifyToken;
