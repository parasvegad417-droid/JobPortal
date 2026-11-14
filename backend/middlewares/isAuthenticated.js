
import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        // Get token from HTTP-only cookie
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.SECRET_KEY
        );

        // Validate decoded user ID
        if (!decoded?.userId) {
            return res.status(401).json({
                message: "Invalid authentication token",
                success: false
            });
        }

        // Attach user ID to request
        req.id = decoded.userId;

        next();

    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
};

export default isAuthenticated;
