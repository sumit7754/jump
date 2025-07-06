const Database = require('better-sqlite3');
const path = require('path');

// Connect to SQLite database
const db = new Database(path.join(__dirname, 'database.sqlite'), { verbose: console.log });

// Initialize the database with a sample table
function initDb() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sample_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `;
  
  db.exec(createTableQuery);
  
  // Check if sample data exists, if not add it
  const count = db.prepare('SELECT COUNT(*) as count FROM sample_items').get();
  
  if (count.count === 0) {
    const insert = db.prepare('INSERT INTO sample_items (name) VALUES (?)');
    insert.run('Sample Item');
  }
}

// Initialize the database
initDb();

module.exports = db; 