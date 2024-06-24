import db from "./accountModel.js";

db.serialize(() => {
    db.run(`
            CREATE TABLE IF NOT EXISTS destinations (
                itemId INTEGER PRIMARY KEY AUTOINCREMENT,
                accountId Integer,
                url TEXT NOT NULL,
                http_method TEXT NOT NULL,
                headers TEXT NOT NULL,
                FORIEGN KEY (accountId) REFERENCES accounts(accountId)
            )
    `)
})

// export default db;