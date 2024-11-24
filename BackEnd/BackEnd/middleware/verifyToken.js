import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        // Extract the token from cookies
        const token = req.cookies?.token;

        // Check if the token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - no token provided"
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - invalid token"
            });
        }

        // Attach user information to the request for further use
        req.user = {
            id: decoded.userId, // Adjust this based on your JWT payload structure
            email: decoded.email // Optional: include additional fields as needed
        };

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in verifyToken middleware: ", error.message);
        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - invalid token"
            });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - token expired"
            });
        }

        // Handle other server errors
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export default verifyToken;