# Interactive Quiz Web Application 🚀

## Overview
This is a fun and interactive quiz application built using **Node.js, Express, SQLite, and Vanilla HTML/CSS/JS**. 
I built this project to test my knowledge and create a cool, functional full-stack application!

## Features
- **User Authentication**: Secure register and login system using `bcryptjs` to protect user passwords.
- **Dynamic Quiz**: Fetches questions from an SQLite database and renders them on the frontend.
- **Timer functionality**: A countdown timer automatically submits the quiz if time runs out!
- **Leaderboard**: Compete with others and see the top 10 scores!
- **Modern UI**: Styled from scratch using CSS flexbox, beautiful gradients, and hover animations, making it look like a professional website.

## Challenges & Solutions (Rubric Criterion 8)
* **Handling Asynchronous Database Calls:** 
  - *Challenge*: Querying SQLite is asynchronous, which caused the server to return empty arrays before the database finished fetching questions.
  - *Solution*: I used callback functions within the `db.all()` and `db.get()` methods, and utilized modern `async/await` syntax for the bcrypt password hashing to ensure the code waited for the data before responding.
* **Secure User Authentication:**
  - *Challenge*: Storing plain text passwords in the SQLite database is a major security risk.
  - *Solution*: Implemented the `bcryptjs` library to salt and hash passwords during registration, and used `bcrypt.compare()` during login.
* **Synchronizing the Quiz Timer:**
  - *Challenge*: The countdown timer would continue running in the background even after the user submitted the quiz early.
  - *Solution*: Assigned the `setInterval` to a global variable `timerInterval` and explicitly called `clearInterval(timerInterval)` inside the `submitQuiz()` function.

## Setup & Installation

1. Create a new directory and clone or copy the project files into it.
2. Open your terminal inside the project directory.
3. Install the required Node.js packages:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Navigate to `http://localhost:3000` in your web browser!

## Future Plans (Deployment)
I plan to connect this later to Vercel to make it a fully online website! The code is organized nicely into `public`, `routes`, and `db` folders to make deployment easier.
