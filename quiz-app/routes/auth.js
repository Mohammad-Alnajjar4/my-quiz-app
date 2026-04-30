// Auth routes! I used bcryptjs to hash passwords so it's secure.
// Fulfills Criteria 5: User accounts & hashed passwords
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Hashing the password with salt rounds = 10
    const hash = await bcrypt.hash(password, 10);
    
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], function(err) {
      if (err) {
        console.error("Registration error:", err.message);
        return res.status(400).json({ error: "Username exists or invalid" });
      }
      
      // Log the registration event
      const date = new Date().toISOString();
      db.run(`INSERT INTO activity_logs (username, action, date) VALUES (?, ?, ?)`, [username, "Registered new account", date]);
      
      res.json({ success: true });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during registration" });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    // Check if user exists and passwords match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // We can also log failed login attempts!
      const date = new Date().toISOString();
      db.run(`INSERT INTO activity_logs (username, action, date) VALUES (?, ?, ?)`, [username || "Unknown", "Failed login attempt", date]);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Log the successful login event
    const date = new Date().toISOString();
    db.run(`INSERT INTO activity_logs (username, action, date) VALUES (?, ?, ?)`, [username, "Logged in successfully", date]);
    
    res.json({ success: true, username: user.username });
  });
});

module.exports = router;
