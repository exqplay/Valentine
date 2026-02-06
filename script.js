// ===== ЭЛЕМЕНТЫ =====
const passwordScreen = document.getElementById("password-screen");
const quizScreen = document.getElementById("quiz-screen");
const finalScreen = document.getElementById("final-screen");
const overlay = document.getElementById("overlay");

const passwordInput = document.getElementById("password-input");
const passwordError = document.getElementById("password-error");

const questionTitle = document.getElementById("question-title");
const answerInput = document.getElementById("answer-input");
const answerError = document.getElementById("answer-error");

const dayEl = document.getElementById("day");
const monthEl = document.getElementById("month");
const yearEl = document.getElementById("year");

// ===== ДАННЫЕ =====
const PASSWORD_HASH = "PASTE_YOUR_HASH_HERE";

const questions = [
  { question: "Первая загадка?", answer: 15 },
  { question: "Вторая загадка?", answer: 2 },
  { question: "Третья загадка?", answer: 2026 }
];

let currentStep = Number(localStorage.getItem("step")) || 0;

// ===== ФУНКЦИИ =====
function switchScreen(from, to) {
  from.classList.remove("active");
  setTimeout(() => {
    to.classList.add("active");
  }, 50);
}

function hash(str) {
  return btoa(str);
}

function checkPassword() {
  if (hash(passwordInput.value.trim()) === PASSWORD_HASH) {
    passwordError.textContent = "";
    switchScreen(passwordScreen, quizScreen);
    showQuiz();
  } else {
    passwordError.textContent = "Неверный пароль";
  }
}

function showQuiz() {
  if (currentStep >= questions.length) {
    showFinal();
    return;
  }

  questionTitle.textContent = questions[currentStep].question;
  answerInput.value = "";
  updateDateProgress();
}

function submitAnswer() {
  const value = answerInput.value.trim();
  if (!value) return;

  if (Number(value) === Number(questions[currentStep].answer)) {
    currentStep++;
    localStorage.setItem("step", currentStep);
    answerError.textContent = "";
    showQuiz();
  } else {
    answerError.textContent = "Подумай ещё 🙂";
  }
}

function updateDateProgress() {
  const parts = ["__", "__", "____"];
  if (currentStep >= 1) parts[0] = "15";
  if (currentStep >= 2) parts[1] = "02";
  if (currentStep >= 3) parts[2] = "2026";

  [dayEl, monthEl, yearEl].forEach((el, i) => {
    el.textContent = parts[i];
    if (!parts[i].includes("_")) el.classList.add("filled");
  });
}

function showFinal() {
  switchScreen(quizScreen, finalScreen);
  updateDateProgress();
  overlay.classList.add("active");

  [dayEl, monthEl, yearEl].forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("pulse");
      setTimeout(() => el.classList.remove("pulse"), 400);
    }, i * 500);
  });

  setTimeout(() => {
    overlay.classList.remove("active");
    document.querySelectorAll(".final-line")
      .forEach((line, i) =>
        setTimeout(() => line.classList.add("visible"), i * 800)
      );
  }, 2000);
}

// ===== АВТОЗАПУСК =====
if (currentStep > 0) {
  passwordScreen.classList.remove("active");
  quizScreen.classList.add("active");
  showQuiz();
}
