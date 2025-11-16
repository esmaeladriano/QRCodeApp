const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data.sqlite');

function getDb() {
  // Ensure directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  return db;
}

function migrate() {
  const db = getDb();
  // Tabela base
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  // Migrar colunas novas sem perder dados
  const cols = db.prepare("PRAGMA table_info(users)").all();
  const hasVerified = cols.some(c => c.name === 'verified');
  const hasVToken = cols.some(c => c.name === 'verification_token');
  if (!hasVerified) {
    db.exec(`ALTER TABLE users ADD COLUMN verified INTEGER NOT NULL DEFAULT 0;`);
  }
  if (!hasVToken) {
    db.exec(`ALTER TABLE users ADD COLUMN verification_token TEXT;`);
  }
  // Índice para token, se não existir
  db.exec(`CREATE INDEX IF NOT EXISTS idx_users_vtoken ON users(verification_token);`);
  console.log('Migration complete.');
}

function seed() {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(1) AS c FROM users').get();
  if (row.c === 0) {
    console.log('Seeding with sample user...');
  } else {
    console.log('Users already exist, skipping seed.');
  }
}

if (require.main === module) {
  const cmd = process.argv[2];
  if (cmd === 'migrate') migrate();
  else if (cmd === 'seed') seed();
  else {
    console.log('Usage: node src/db.js [migrate|seed]');
    process.exit(1);
  }
}

module.exports = { getDb, migrate };
