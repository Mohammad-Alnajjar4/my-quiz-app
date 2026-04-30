// My main server entry point! 
// This connects the backend to the frontend and starts the Express app.
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serves HTML/CSS/JS from public folder

// My API Routes
app.use('/auth', authRoutes);
app.use('/api', quizRoutes);

// Handling 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Database connected and ready!`);
});
