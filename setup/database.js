const {
  createDatabase,
  initializeTables,
  testConnection,
} = require("../config/database");

async function setupDatabase() {
  try {
    // Step 1: Create database
    await createDatabase();

    // Step 2: Test connection
    await testConnection();

    // Step 3: Create tables
    await initializeTables();
  } catch (error) {
    console.error("Database setup failed:", error.message);
  } finally {
    process.exit(0); // Exit the process after setup
  }
}

setupDatabase();
