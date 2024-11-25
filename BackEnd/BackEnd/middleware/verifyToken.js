import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no token provided",
      });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log('Decoded Token:', decoded); // Debugging log
  
      req.userId = decoded.userId; // Ensure this field exists in your token
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - invalid token',
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - token expired',
        });
      } else {
        console.error('Error in verifyToken: ', error.message);
        return res.status(500).json({
          success: false,
          message: 'Server error',
        });
      }
    }
  };
  

export default verifyToken;
