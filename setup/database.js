const { createDatabase, initializeTables, testConnection } = require('../config/database');

async function setupDatabase() {
    console.log('🚀 Setting up database...');
    
    try {
        // Step 1: Create database
        await createDatabase();
        
        // Step 2: Test connection
        await testConnection();
        
        // Step 3: Create tables
        await initializeTables();
        
        console.log('🎉 Database setup completed successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Make sure your MySQL server is running');
        console.log('2. Update your .env file with correct database credentials');
        console.log('3. Run: npm run dev');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.log('');
        console.log('Please check:');
        console.log('1. MySQL server is running');
        console.log('2. Database credentials in .env file are correct');
        console.log('3. You have necessary permissions');
    } finally {
        process.exit(0);
    }
}

setupDatabase();
