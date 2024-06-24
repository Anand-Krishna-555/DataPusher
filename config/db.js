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
    `, (err) => {
        // console.log("Err =-> 1", err);
    });

    db.run(`
            CREATE TABLE IF NOT EXISTS destinations (
                itemId INTEGER PRIMARY KEY AUTOINCREMENT,
                accountId INTEGER,
                url TEXT NOT NULL,
                http_method TEXT NOT NULL,
                headers TEXT NOT NULL,
                FOREIGN KEY (accountId) REFERENCES accounts(accountId)
            )
    `, (err) => {
        // console.log("Err =-> 2", err);
    });
});

export default db;
