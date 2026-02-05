// ===== НАСТРОЙКИ =====

// SHA-256 хэш пароля
// (как получить — ниже)
const PASSWORD_HASH =
  "PUT_HASH_HERE";

// загадки
const questions = [
  {
    text: "Сколько букв в слове «любовь»?",
    answer: "6"
  },
  {
    text: "Сколько месяцев в году?",
    answer: "12"
  },
  {
    text: "Сколько дней в феврале в невисокосный год?",
    answer: "28"
  }
];

// =====================

let currentStep = Number(localStorage.getItem("step")) || 0;

// DOM
const passwordScreen = document.getElementById("password-screen");
const quizScreen = document.getElementById("quiz-screen");
const finalScreen = document.getElementById("final-screen");
const questionTitle = document.getElementById("question-title");
const answerInput = document.getElementById("answer-input");
const answerError = document.getElementById("answer-error");
const passwordError = document.getElementById("password-error");

// автологин
if (localStorage.getItem("access") === "true") {
  passwordScreen.classList.remove("active");
  showQuiz();
}

// SHA-256
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// проверка пароля
async function checkPassword() {
  const input = document.getElementById("password-input").value.trim();

  if (!input) {
    passwordError.textContent = "Введите пароль";
    return;
  }

  const hashed = await sha256(input);

  if (hashed === PASSWORD_HASH) {
    localStorage.setItem("access", "true");
    passwordError.textContent = "";
    passwordScreen.classList.remove("active");
    showQuiz();
  } else {
    passwordError.textContent = "Неверный пароль 💔";
  }
}

// показать загадку
function showQuiz() {
  if (currentStep >= questions.length) {
    showFinal();
    return;
  }

  quizScreen.classList.add("active");
  questionTitle.textContent = questions[currentStep].text;
}

// отправка ответа
function submitAnswer() {
  const value = answerInput.value.trim();

  if (!value) {
    answerError.textContent = "Напиши число 🙂";
    return;
  }

  if (value === questions[currentStep].answer) {
    currentStep++;
    localStorage.setItem("step", currentStep);
    answerInput.value = "";
    answerError.textContent = "";
    showQuiz();
  } else {
    answerError.textContent = "Подумай ещё 😉";
  }
}

// финал
function showFinal() {
  quizScreen.classList.remove("active");
  finalScreen.classList.add("active");
}
