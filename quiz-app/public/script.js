// Fulfills Criteria 4: Dynamic features, timer, DOM updates
const API = 'http://localhost:3000';

// Handle user registration
async function handleRegister(e) {
  e.preventDefault();
  const u = document.getElementById('reg-username').value;
  const p = document.getElementById('reg-password').value;
  
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify({username: u, password: p})
    });
    
    if(res.ok) {
      window.location.href = 'login.html';
    } else {
      document.getElementById('reg-error').innerText = 'Username taken or error occurred.';
    }
  } catch (err) {
    console.error("Register err:", err);
  }
}

// Handle user login
async function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById('log-username').value;
  const p = document.getElementById('log-password').value;
  
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify({username: u, password: p})
    });
    
    if(res.ok) {
      // Save user to localStorage so I know who is logged in!
      localStorage.setItem('user', u);
      window.location.href = 'quiz.html';
    } else {
      document.getElementById('log-error').innerText = 'Invalid credentials!';
    }
  } catch (err) {
    console.error("Login err:", err);
  }
}

// Quiz Variables
let questions = [];
let score = 0;
let timerInterval;

// Initialize the quiz page
async function initQuiz() {
  const user = localStorage.getItem('user');
  if(!user) {
    alert("Please log in first!");
    window.location.href = 'login.html';
    return;
  }

  const res = await fetch(`${API}/api/questions`);
  questions = await res.json();
  const container = document.getElementById('quiz-questions');
  
  // Render questions
  questions.forEach((q, index) => {
    let block = `
      <div class="question-block" style="margin-bottom: 20px;">
        <h3>${index + 1}. ${q.question}</h3>
    `;
    q.options.forEach(opt => {
      block += `
        <label class="quiz-option">
          <input type="radio" name="q${index}" value="${opt}"> ${opt}
        </label>
      `;
    });
    block += `</div>`;
    container.innerHTML += block;
  });

  // Start the timer (Challenge 3: Synchronizing timer)
  let time = 60;
  document.getElementById('time').innerText = time;
  timerInterval = setInterval(() => {
    time--;
    document.getElementById('time').innerText = time;
    if (time <= 0) submitQuiz();
  }, 1000);
}

// Calculate score and submit to DB
async function submitQuiz() {
  // Clear the timer so it stops running in background!
  clearInterval(timerInterval);
  score = 0;
  
  questions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected && selected.value === q.answer) score++;
  });

  const user = localStorage.getItem('user') || 'Guest';
  
  try {
    await fetch(`${API}/api/score`, {
      method: 'POST', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify({username: user, score})
    });
  } catch(err) {
    console.error("Score submit error:", err);
  }

  localStorage.setItem('lastScore', score);
  localStorage.setItem('totalQuestions', questions.length);
  window.location.href = 'results.html';
}

// Fetch and display leaderboard
async function initLeaderboard() {
  try {
    const res = await fetch(`${API}/api/leaderboard`);
    const data = await res.json();
    const list = document.getElementById('leaderboard-list');
    
    if(data.length === 0) {
      list.innerHTML = "<p>No scores yet! Be the first!</p>";
      return;
    }
    
    data.forEach((item, index) => {
      list.innerHTML += `
        <div class="leaderboard-item">
          <strong>#${index + 1} ${item.username}</strong>
          <span>${item.score} points</span>
        </div>
      `;
    });
  } catch(err) {
    console.error("Leaderboard fetch error:", err);
  }
}

// Automatically update results page score
if (document.getElementById('score-display')) {
  const s = localStorage.getItem('lastScore');
  const t = localStorage.getItem('totalQuestions');
  document.getElementById('score-display').innerText = `${s} / ${t}`;
}

// User greeting if logged in
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('user');
  const greeting = document.getElementById('user-greeting');
  if(user && greeting) {
    greeting.innerText = `Welcome back, ${user}!`;
  }
});
