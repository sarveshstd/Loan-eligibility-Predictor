/**
 * AI Loan Eligibility Checker - Server Entry Point
 * 
 * This is the main server file that sets up Express,
 * MongoDB connection, and all API routes.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '.env');
console.log('🔍 Looking for .env at:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.warn('⚠ Error loading .env file:', result.error.message);
} else {
    console.log('✓ .env file loaded successfully');
    console.log('📝 Environment variables:', {
        MONGODB_URI: process.env.MONGODB_URI ? 'SET (hidden for security)' : 'NOT SET',
        PORT: process.env.PORT,
        JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET'
    });
}

// Debug: Verify environment variables are loaded
if (!process.env.MONGODB_URI) {
    console.warn('⚠ Warning: MONGODB_URI is not set in .env file');
}

// Import routes
const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loan');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/ai', require('./routes/ai'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Loan Eligibility Checker API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// MongoDB Connection
const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URI;
        console.log(`📊 Attempting to connect to: ${mongoUrl ? mongoUrl.substring(0, 50) + '...' : 'UNDEFINED'}`);
        
        if (!mongoUrl) {
            throw new Error('MONGODB_URI environment variable is not set');
        }
        
        const conn = await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error('✗ MongoDB connection error:', error.message);
        return false;
    }
};

// Connect to database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    const dbConnected = await connectDB();
    
    if (!dbConnected) {
        console.error('⚠ Failed to connect to MongoDB. Please check:');
        console.error('  1. MongoDB URI in .env file is correct');
        console.error('  2. Network connectivity to MongoDB Atlas');
        console.error('  3. IP whitelist in MongoDB Atlas (Allow 0.0.0.0)\n');
        process.exit(1);
    }
    
    app.listen(PORT, () => {
        console.log(`✓ Server running on port ${PORT}`);
        console.log(`✓ API: http://localhost:${PORT}/api`);
        console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
    });
};

startServer();

module.exports = app;
