import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
            accountId INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            account_name TEXT NOT NULL,
            app_secret_token TEXT NOI NULL,
            website TEXT
        )
    `);
});

// export default db;
