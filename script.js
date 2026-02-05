// ===== НАСТРОЙКИ =====

// SHA-256 хэш пароля
// пароль: DASJKD12CDS
const PASSWORD_HASH =
  "a4963c50cd25fdf92fee9178af3655b0eaff2938adc1fa0e074d25e6f456fd74";

// Загадки и ответы
const questions = [
  { text: "Сколько букв в слове «любовь»?", answer: "6" },
  { text: "Сколько месяцев в году?", answer: "12" },
  { text: "Сколько дней в феврале в невисокосный год?", answer: "28" }
];

// =====================

let currentStep = Number(localStorage.getItem("step")) || 0;

// DOM элементы
const passwordScreen = document.getElementById("password-screen");
const quizScreen = document.getElementById("quiz-screen");
const finalScreen = document.getElementById("final-screen");
const questionTitle = document.getElementById("question-title");
const answerInput = document.getElementById("answer-input");
const answerError = document.getElementById("answer-error");
const passwordError = document.getElementById("password-error");
const dayEl = document.getElementById("day");
const monthEl = document.getElementById("month");
const yearEl = document.getElementById("year");
const overlay = document.getElementById("overlay");

// Автологин если уже вводили пароль
if (localStorage.getItem("access") === "true") {
  passwordScreen.classList.remove("active");
  showQuiz();
}

// SHA-256 функция
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Проверка пароля
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

// Обновление прогресса даты
function updateDateProgress() {
  if (currentStep >= 1) {
    dayEl.textContent = "15";
    dayEl.classList.add("filled");
  }
  if (currentStep >= 2) {
    monthEl.textContent = "02";
    monthEl.classList.add("filled");
  }
  if (currentStep >= 3) {
    yearEl.textContent = "2026";
    yearEl.classList.add("filled");
  }
}

// Показ загадки
function showQuiz() {
  updateDateProgress();

  if (currentStep >= questions.length) {
    showFinal();
    return;
  }

  quizScreen.classList.add("active");
  questionTitle.textContent = questions[currentStep].text;
}

// Отправка ответа
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

// Финальный экран с анимацией
function showFinal() {
  // Показываем финальный экран сразу
  quizScreen.classList.remove("active");
  finalScreen.classList.add("active");

  // Дата остаётся на секунду
  updateDateProgress();

  // Затемнение overlay
  overlay.classList.add("active");

  // Через 1 секунду убираем overlay и запускаем построчную анимацию + пульс
  setTimeout(() => {
    overlay.classList.remove("active");

    const lines = document.querySelectorAll(".final-line");
    lines.forEach((line, index) => {
      setTimeout(() => line.classList.add("visible"), index * 800);
    });
  }, 1000); // 1 секунда пауза для демонстрации даты
}

// Вспомогательная кнопка для теста (очистка прогресса)
// Можно временно добавить в HTML:
// <button onclick="localStorage.clear(); location.reload();">Сбросить прогресс</button>
