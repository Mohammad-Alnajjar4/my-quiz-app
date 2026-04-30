// === SUPABASE INITIALIZATION ===
// Here is your project URL. You MUST replace "YOUR_ANON_KEY_HERE" with your actual anon key from the Supabase Dashboard!
// Go to Supabase Dashboard -> Project Settings -> API -> anon public key
const SUPABASE_URL = 'https://vgrbteilsrqyttgvdoki.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================

let currentUser = "Guest";

const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Transfer Markup Language",
      "Hyper Transfer Markup Logic",
      "Home Tool Markup Language"
    ],
    answer: 0
  },
  {
    question: "Which HTML tag is used to create a hyperlink?",
    options: [
      "<link>",
      "<href>",
      "<a>",
      "<url>"
    ],
    answer: 2
  },
  {
    question: "Which HTML tag is used to define the largest heading?",
    options: [
      "<h6>",
      "<heading>",
      "<head>",
      "<h1>"
    ],
    answer: 3
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Syntax"
    ],
    answer: 1
  },
  {
    question: "Which CSS property is used to change the text color?",
    options: [
      "font-color",
      "text-color",
      "color",
      "foreground"
    ],
    answer: 2
  },
  {
    question: "Which HTML element is used to define an unordered list?",
    options: [
      "<ol>",
      "<list>",
      "<li>",
      "<ul>"
    ],
    answer: 3
  },
  {
    question: "How do you add a comment in CSS?",
    options: [
      "// This is a comment",
      "<!-- This is a comment -->",
      "/* This is a comment */",
      "** This is a comment **"
    ],
    answer: 2
  },
  {
    question: "Which CSS property controls the space inside an element's border?",
    options: [
      "margin",
      "spacing",
      "padding",
      "border-space"
    ],
    answer: 2
  },
  {
    question: "Which HTML attribute specifies an alternate text for an image?",
    options: [
      "title",
      "alt",
      "src",
      "caption"
    ],
    answer: 1
  },
  {
    question: "Which CSS value makes an element invisible but still takes up space?",
    options: [
      "display: none",
      "opacity: 0",
      "visibility: hidden",
      "hidden: true"
    ],
    answer: 2
  }
];

let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const retryBtn = document.getElementById('retry-btn');
const nextBtnContainer = document.getElementById('next-btn-container');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionNumber = document.getElementById('question-number');
const progressBar = document.getElementById('progress-bar');
const quizCard = document.querySelector('.quiz-card');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', loadNextQuestion);
retryBtn.addEventListener('click', resetQuiz);

function startQuiz() {
  const usernameInput = document.getElementById('username-input');
  if (usernameInput.value.trim() !== '') {
    currentUser = usernameInput.value.trim();
  } else {
    alert("Please enter a name to register your score!");
    return; // Don't start if they don't enter a name
  }

  currentQuestionIndex = 0;
  score = 0;
  startScreen.classList.remove('active');
  quizScreen.classList.add('active');
  loadQuestion();
}

function loadQuestion() {
  // Add animation class
  quizCard.classList.remove('card-in');
  void quizCard.offsetWidth; // trigger reflow
  quizCard.classList.add('card-in');

  const q = questions[currentQuestionIndex];
  questionText.innerText = q.question;
  questionNumber.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  
  // Update progress bar
  const progressPercent = (currentQuestionIndex / questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;

  optionsContainer.innerHTML = '';
  nextBtnContainer.style.display = 'none';

  const letters = ['A', 'B', 'C', 'D'];

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn fade-up';
    btn.style.animationDelay = `${0.1 + (index * 0.1)}s`;
    
    // Replace < and > so HTML tags display properly
    const safeOpt = opt.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    btn.innerHTML = `
      <span class="option-letter">${letters[index]}</span>
      <span class="option-text">${safeOpt}</span>
    `;
    
    btn.onclick = () => selectAnswer(index, btn);
    optionsContainer.appendChild(btn);
  });
}

function selectAnswer(selectedIndex, selectedBtn) {
  const q = questions[currentQuestionIndex];
  const allBtns = optionsContainer.querySelectorAll('.option-btn');
  
  // Disable all buttons
  allBtns.forEach(btn => btn.disabled = true);

  if (selectedIndex === q.answer) {
    selectedBtn.classList.add('correct');
    score++;
  } else {
    selectedBtn.classList.add('wrong');
    // Highlight correct answer
    allBtns[q.answer].classList.add('correct');
  }

  nextBtnContainer.style.display = 'flex';
}

function loadNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizScreen.classList.remove('active');
  resultsScreen.classList.add('active');
  
  progressBar.style.width = '100%';

  document.getElementById('score-display').innerText = `${score} / ${questions.length}`;
  
  const resultBadge = document.getElementById('result-badge');
  const resultMessage = document.getElementById('result-message');
  
  resultBadge.className = 'result-badge fade-up delay-3'; // reset classes

  if (score >= 9) {
    resultBadge.innerText = '🏆 Excellent!';
    resultBadge.classList.add('excellent');
    resultMessage.innerText = 'Amazing job! You really know your stuff.';
  } else if (score >= 6) {
    resultBadge.innerText = '👍 Good Job!';
    resultBadge.classList.add('good');
    resultMessage.innerText = 'Solid foundation, but there is still room to grow.';
  } else {
    resultBadge.innerText = '📚 Keep Practicing';
    resultBadge.classList.add('practice');
    resultMessage.innerText = 'Review the basics of HTML and CSS and try again.';
  }
  
  // Save to Supabase and then fetch Leaderboard
  saveScoreToSupabase();
}

async function saveScoreToSupabase() {
  try {
    const { data, error } = await supabase
      .from('scores')
      .insert([
        { username: currentUser, score: score, date: new Date().toISOString() }
      ]);
      
    if (error) throw error;
    console.log("Score saved successfully!");
  } catch (error) {
    console.error("Error saving score to Supabase:", error.message);
  }
  
  // Always fetch leaderboard after saving
  fetchLeaderboard();
}

async function fetchLeaderboard() {
  const leaderboardList = document.getElementById('leaderboard-list');
  leaderboardList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Loading live scores...</p>';
  
  try {
    // Get top 10 scores
    const { data, error } = await supabase
      .from('scores')
      .select('username, score')
      .order('score', { ascending: false })
      .limit(10);
      
    if (error) throw error;
    
    leaderboardList.innerHTML = ''; // Clear loading
    
    if (data.length === 0) {
      leaderboardList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No scores yet. Be the first!</p>';
      return;
    }
    
    data.forEach((entry, index) => {
      leaderboardList.innerHTML += `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid var(--border);">
          <span><strong>#${index + 1}</strong> ${entry.username}</span>
          <span style="color: var(--accent); font-weight: 600;">${entry.score} pts</span>
        </div>
      `;
    });
    
  } catch (error) {
    console.error("Error fetching leaderboard:", error.message);
    leaderboardList.innerHTML = '<p style="text-align: center; color: var(--wrong);">Failed to load leaderboard. Check API Keys.</p>';
  }
}

function resetQuiz() {
  resultsScreen.classList.remove('active');
  startQuiz();
}
