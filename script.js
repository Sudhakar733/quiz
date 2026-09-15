/* =========================================================
   QUIZARENA — script.js
   20-question timed trivia quiz. Vanilla JS, no dependencies.
========================================================= */

const QUESTIONS = [
  { category: 'Geography', q: 'Which is the largest country in the world by area?', options: ['China', 'Canada', 'Russia', 'USA'], answer: 2 },
  { category: 'Science', q: 'What gas do plants absorb from the atmosphere for photosynthesis?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], answer: 2 },
  { category: 'History', q: 'In which year did the Second World War end?', options: ['1943', '1945', '1947', '1950'], answer: 1 },
  { category: 'Sports', q: 'How many players are on a football (soccer) team on the pitch?', options: ['9', '10', '11', '12'], answer: 2 },
  { category: 'Pop Culture', q: 'Which fictional wizarding school does Harry Potter attend?', options: ['Durmstrang', 'Beauxbatons', 'Hogwarts', 'Ilvermorny'], answer: 2 },
  { category: 'Geography', q: 'The Great Barrier Reef is located off the coast of which country?', options: ['Brazil', 'Australia', 'South Africa', 'Indonesia'], answer: 1 },
  { category: 'Science', q: 'What is the chemical symbol for gold?', options: ['Ag', 'Au', 'Gd', 'Go'], answer: 1 },
  { category: 'History', q: 'Who was the first President of the United States?', options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'], answer: 2 },
  { category: 'Sports', q: 'In which sport would you perform a "slam dunk"?', options: ['Volleyball', 'Basketball', 'Tennis', 'Badminton'], answer: 1 },
  { category: 'Pop Culture', q: 'Which streaming platform produced the series "Stranger Things"?', options: ['Amazon Prime', 'Disney+', 'Netflix', 'Hulu'], answer: 2 },
  { category: 'Geography', q: 'Which river is the longest in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], answer: 1 },
  { category: 'Science', q: 'How many bones are there in the adult human body?', options: ['186', '206', '226', '246'], answer: 1 },
  { category: 'History', q: 'The ancient pyramids of Giza were built in which country?', options: ['Mexico', 'Sudan', 'Egypt', 'Peru'], answer: 2 },
  { category: 'Sports', q: 'Which country has won the most FIFA World Cup titles?', options: ['Germany', 'Argentina', 'Italy', 'Brazil'], answer: 3 },
  { category: 'Pop Culture', q: 'Who directed the movie "Jaws" and "Jurassic Park"?', options: ['James Cameron', 'Steven Spielberg', 'Christopher Nolan', 'Martin Scorsese'], answer: 1 },
  { category: 'Geography', q: 'Mount Kilimanjaro is located in which country?', options: ['Kenya', 'Tanzania', 'Uganda', 'Ethiopia'], answer: 1 },
  { category: 'Science', q: 'What planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], answer: 2 },
  { category: 'History', q: 'The Berlin Wall fell in which year?', options: ['1987', '1989', '1991', '1993'], answer: 1 },
  { category: 'Sports', q: 'In tennis, what term describes a score of zero?', options: ['Deuce', 'Ace', 'Love', 'Fault'], answer: 2 },
  { category: 'Pop Culture', q: 'Which artist released the album "Thriller"?', options: ['Prince', 'Michael Jackson', 'Elvis Presley', 'Stevie Wonder'], answer: 1 }
];

const TIME_PER_QUESTION = 15;
const RING_CIRCUMFERENCE = 213.6;

// ---------- state ----------
let currentIndex = 0;
let score = 0;
let wrongCount = 0;
let skippedCount = 0;
let timeLeft = TIME_PER_QUESTION;
let timerInterval = null;
let answered = false;

// ---------- elements ----------
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const liveScore = document.getElementById('liveScore');
const liveScoreVal = document.getElementById('liveScoreVal');

const progressFill = document.getElementById('progressFill');
const qNum = document.getElementById('qNum');
const qCategory = document.getElementById('qCategory');
const questionText = document.getElementById('questionText');
const optionsGrid = document.getElementById('optionsGrid');
const feedbackLine = document.getElementById('feedbackLine');

const timerBar = document.getElementById('timerBar');
const timerNum = document.getElementById('timerNum');

function showScreen(el){
  [startScreen, quizScreen, resultScreen].forEach(s => s.hidden = true);
  el.hidden = false;
}

// ---------- start ----------
startBtn.addEventListener('click', () => {
  currentIndex = 0;
  score = 0;
  wrongCount = 0;
  skippedCount = 0;
  liveScoreVal.textContent = '0';
  liveScore.hidden = false;
  showScreen(quizScreen);
  loadQuestion();
});

restartBtn.addEventListener('click', () => {
  liveScore.hidden = true;
  showScreen(startScreen);
});

// ---------- load a question ----------
function loadQuestion(){
  answered = false;
  const item = QUESTIONS[currentIndex];

  qNum.textContent = currentIndex + 1;
  qCategory.textContent = item.category;
  questionText.textContent = item.q;
  progressFill.style.width = `${(currentIndex / QUESTIONS.length) * 100}%`;
  feedbackLine.textContent = '\u00A0';
  feedbackLine.className = 'feedback-line';

  optionsGrid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  item.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => selectOption(i));
    optionsGrid.appendChild(btn);
  });

  startTimer();
}

// ---------- timer ----------
function startTimer(){
  clearInterval(timerInterval);
  timeLeft = TIME_PER_QUESTION;
  timerNum.textContent = timeLeft;
  timerBar.style.strokeDashoffset = 0;
  timerBar.classList.remove('urgent');

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    timerNum.textContent = timeLeft;
    const offset = RING_CIRCUMFERENCE * (1 - timeLeft / TIME_PER_QUESTION);
    timerBar.style.strokeDashoffset = offset;
    if (timeLeft <= 5) timerBar.classList.add('urgent');

    if (timeLeft <= 0){
      clearInterval(timerInterval);
      handleTimeUp();
    }
  }, 1000);
}

function handleTimeUp(){
  if (answered) return;
  answered = true;
  skippedCount += 1;
  revealAnswer(-1);
  feedbackLine.textContent = "Time's up — no answer selected";
  feedbackLine.className = 'feedback-line timeup';
  scheduleNext();
}

// ---------- selecting an option ----------
function selectOption(selectedIndex){
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);

  const item = QUESTIONS[currentIndex];
  const isCorrect = selectedIndex === item.answer;

  if (isCorrect){
    score += 1;
    liveScoreVal.textContent = score;
    feedbackLine.textContent = 'Correct!';
    feedbackLine.className = 'feedback-line correct';
  } else {
    wrongCount += 1;
    feedbackLine.textContent = `Not quite — the right answer is "${item.options[item.answer]}"`;
    feedbackLine.className = 'feedback-line wrong';
  }

  revealAnswer(selectedIndex);
  scheduleNext();
}

function revealAnswer(selectedIndex){
  const item = QUESTIONS[currentIndex];
  const buttons = optionsGrid.querySelectorAll('.option-btn');
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === item.answer){
      btn.classList.add('correct');
    } else if (i === selectedIndex){
      btn.classList.add('wrong');
    } else {
      btn.classList.add('reveal');
    }
  });
}

function scheduleNext(){
  setTimeout(() => {
    currentIndex += 1;
    if (currentIndex >= QUESTIONS.length){
      endQuiz();
    } else {
      loadQuestion();
    }
  }, 1400);
}

// ---------- end of quiz ----------
const scoreFraction = document.getElementById('scoreFraction');
const scorePercent = document.getElementById('scorePercent');
const scoreBar = document.getElementById('scoreBar');
const scoreTitle = document.getElementById('scoreTitle');
const scoreMessage = document.getElementById('scoreMessage');
const statCorrect = document.getElementById('statCorrect');
const statWrong = document.getElementById('statWrong');
const statSkipped = document.getElementById('statSkipped');
const SCORE_CIRCUMFERENCE = 439.8;

function endQuiz(){
  progressFill.style.width = '100%';
  showScreen(resultScreen);
  liveScore.hidden = true;

  const total = QUESTIONS.length;
  const pct = Math.round((score / total) * 100);

  scoreFraction.textContent = `${score}/${total}`;
  scorePercent.textContent = `${pct}%`;
  statCorrect.textContent = score;
  statWrong.textContent = wrongCount;
  statSkipped.textContent = skippedCount;

  scoreBar.style.strokeDashoffset = SCORE_CIRCUMFERENCE;
  requestAnimationFrame(() => {
    setTimeout(() => {
      scoreBar.style.strokeDashoffset = SCORE_CIRCUMFERENCE * (1 - pct / 100);
    }, 100);
  });

  if (pct >= 90){
    scoreTitle.textContent = 'Quiz Master! \ud83c\udfc6';
    scoreMessage.textContent = "That's an outstanding round — you barely let the timer breathe.";
    launchConfetti();
  } else if (pct >= 70){
    scoreTitle.textContent = 'Sharp mind \u26a1';
    scoreMessage.textContent = 'Strong performance — a few more rounds and you\'ll be unstoppable.';
    launchConfetti();
  } else if (pct >= 50){
    scoreTitle.textContent = 'Not bad at all \ud83d\udc4d';
    scoreMessage.textContent = "You held your own out there. Try again and beat your score.";
  } else {
    scoreTitle.textContent = 'Time for a rematch \ud83d\udcda';
    scoreMessage.textContent = "Every trivia champion started somewhere. Give it another shot.";
  }
}

// ---------- confetti ----------
const confettiLayer = document.getElementById('confettiLayer');
const CONFETTI_COLORS = ['#ffc857', '#3ecf8e', '#3a3f8f', '#ff5c6c', '#fdfbf6'];

function launchConfetti(){
  for (let i = 0; i < 60; i++){
    const piece = document.createElement('div');
    piece.className = 'confetto';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 5500);
  }
}