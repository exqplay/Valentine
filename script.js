// ===== НАСТРОЙКИ =====

// пароль → захешируй свой (см. ниже)
const PASSWORD_HASH = "e3afed0047b08059d0fada10f400c1e5";

// загадки и ответы (ответы — числа)
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

// элементы
const passwordScreen = document.getElementById("password-screen");
const quizScreen = document.getElementById("quiz-screen");
const finalScreen = document.getElementById("final-screen");
const questionTitle = document.getElementById("question-title");
const answerInput = document.getElementById("answer-input");
const answerError = document.getElementById("answer-error");

// если уже прошла пароль
if (localStorage.getItem("access") === "true") {
  showQuiz();
}

// хэш-функция
async function hash(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("MD5", msgUint8);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// проверка пароля
async function checkPassword() {
  const input = document.getElementById("password-input").value;
  const hashed = await hash(input);

  if (hashed === PASSWORD_HASH) {
    localStorage.setItem("access", "true");
    passwordScreen.classList.remove("active");
    showQuiz();
  } else {
    document.getElementById("password-error").textContent =
      "Неверный пароль";
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

  if (value === questions[currentStep].answer) {
    currentStep++;
    localStorage.setItem("step", currentStep);
    answerInput.value = "";
    answerError.textContent = "";
    showQuiz();
  } else {
    answerError.textContent = "Подумай ещё 🙂";
  }
}

// финал
function showFinal() {
  quizScreen.classList.remove("active");
  finalScreen.classList.add("active");
}