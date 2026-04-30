// Here are my API routes for handling the quiz data and scores
const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Get all the questions for the quiz
router.get('/questions', (req, res) => {
  db.all(`SELECT * FROM questions`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch questions" });
    }
    // I need to parse the JSON options back into an array
    res.json(rows.map(r => ({...r, options: JSON.parse(r.options)})));
  });
});

// Save a user's score to the database
router.post('/score', (req, res) => {
  const { username, score } = req.body;
  const date = new Date().toISOString();
  
  db.run(`INSERT INTO scores (username, score, date) VALUES (?, ?, ?)`, [username, score, date], (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save score" });
    }
    
    // Log the quiz submission
    db.run(`INSERT INTO activity_logs (username, action, date) VALUES (?, ?, ?)`, [username, `Submitted quiz with score: ${score}`, date]);
    
    res.json({ success: true });
  });
});

// Get top 10 scores for the leaderboard!
router.get('/leaderboard', (req, res) => {
  db.all(`SELECT username, score FROM scores ORDER BY score DESC LIMIT 10`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
    res.json(rows);
  });
});

// Admin Route: Get all activity logs and users
router.get('/logs', (req, res) => {
  db.all(`SELECT * FROM activity_logs ORDER BY date DESC`, [], (err, logs) => {
    db.all(`SELECT id, username FROM users`, [], (err, users) => {
      res.json({ logs, users });
    });
  });
});

module.exports = router;
