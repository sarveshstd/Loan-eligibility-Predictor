const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @middleware   authMiddleware
 * @desc         Verify JWT token and attach user to request
 * @access       Private
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        // Check if token starts with 'Bearer '
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7, authHeader.length) 
            : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'default-secret-key'
        );

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        }

        // Attach user to request
        req.user = user;
        next();

    } catch (error) {
        console.error('AUTH MIDDLEWARE ERROR:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error in auth middleware'
        });
    }
};

module.exports = authMiddleware;
