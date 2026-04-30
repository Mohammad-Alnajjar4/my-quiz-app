// I set up the SQLite database here.
// Fulfills Criteria 5: SQLite Database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./quiz.db');

db.serialize(() => {
  // Creating tables for my users, questions, and scores
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY, category TEXT, question TEXT, options TEXT, answer TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY, username TEXT, score INTEGER, date TEXT)`);
  
  // NEW: Table to track every action (logins, registrations, quiz completions)
  db.run(`CREATE TABLE IF NOT EXISTS activity_logs (id INTEGER PRIMARY KEY, username TEXT, action TEXT, date TEXT)`);

  // Pre-populate some questions if the table is empty so the quiz isn't blank
  db.get("SELECT count(*) as count FROM questions", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO questions (category, question, options, answer) VALUES (?, ?, ?, ?)");
      stmt.run("Science", "What is the chemical symbol for water?", JSON.stringify(["H2O", "O2", "CO2", "NaCl"]), "H2O");
      stmt.run("Math", "What is 5 + 7?", JSON.stringify(["10", "11", "12", "13"]), "12");
      stmt.run("History", "Who was the first president of the US?", JSON.stringify(["Lincoln", "Washington", "Adams", "Jefferson"]), "Washington");
      // Add a couple more questions to make it a real quiz!
      stmt.run("Geography", "What is the capital of France?", JSON.stringify(["London", "Berlin", "Paris", "Madrid"]), "Paris");
      stmt.run("Science", "Which planet is known as the Red Planet?", JSON.stringify(["Earth", "Mars", "Jupiter", "Venus"]), "Mars");
      stmt.finalize();
      console.log("Database seeded with sample questions!");
    }
  });
});

module.exports = db;
