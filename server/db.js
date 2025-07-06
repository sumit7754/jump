const Database = require('better-sqlite3');
const path = require('path');

// Connect to SQLite database
const db = new Database(path.join(__dirname, 'database.sqlite'), { verbose: console.log });

// Initialize the database with a sample table
function initDb() {
  const createConversionsTable = `
    CREATE TABLE IF NOT EXISTS conversions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount TEXT NOT NULL,
      targetCurrency TEXT NOT NULL,
      result REAL NOT NULL,
      timestamp TEXT NOT NULL
    )
  `;
  
  db.exec(createConversionsTable);

}

// Initialize the database
initDb();

module.exports = db; 