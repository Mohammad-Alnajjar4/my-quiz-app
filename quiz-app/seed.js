const bcrypt = require('bcryptjs');
const db = require('./db/database');

const dummyUsers = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];

db.serialize(() => {
    dummyUsers.forEach(async (username) => {
        const hash = await bcrypt.hash('password123', 10);
        db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, [username, hash], function(err) {
            if (err) {
                console.error(`Error inserting ${username}:`, err.message);
            } else {
                console.log(`Inserted dummy user: ${username}`);
            }
        });
    });
});

setTimeout(() => {
    console.log("Database seeded with sample users!");
    db.close();
}, 2000);
