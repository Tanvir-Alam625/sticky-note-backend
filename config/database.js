const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
};

// Create connection pool
const pool = mysql.createPool({
    ...dbConfig,
    database: process.env.DB_NAME || 'sticky_notes_db',
    connectionLimit: 10
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully!');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Create database if it doesn't exist
async function createDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'sticky_notes_db'}`);
        console.log('✅ Database created/verified successfully!');
        await connection.end();
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        throw error;
    }
}

// Initialize database tables
async function initializeTables() {
    try {
        // Users table
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;

        // Notes table
        const createNotesTable = `
            CREATE TABLE IF NOT EXISTS notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                color VARCHAR(7) DEFAULT '#FFEB3B',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;

        await pool.execute(createUsersTable);
        await pool.execute(createNotesTable);
        
        console.log('✅ Database tables created/verified successfully!');
    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
        throw error;
    }
}

module.exports = {
    pool,
    testConnection,
    createDatabase,
    initializeTables
};
