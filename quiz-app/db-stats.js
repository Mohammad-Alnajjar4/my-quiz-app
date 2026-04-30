const db = require('./db/database');

// Function to get and print the organized stats
function printStats() {
    db.all(`SELECT username FROM users`, [], (err, users) => {
        if (err) {
            console.error("Error fetching users:", err);
            return;
        }

        console.log("\n========================================");
        console.log("          REGISTRY STATISTICS           ");
        console.log("========================================");
        console.log(`Total Registered Users: ${users.length}`);
        console.log("----------------------------------------");
        
        if (users.length === 0) {
            console.log("No users registered yet.");
        } else {
            console.log("Registry Names:");
            users.forEach((user, index) => {
                console.log(`  ${index + 1}. ${user.username}`);
            });
        }
        console.log("========================================\n");
        db.close();
    });
}

printStats();
