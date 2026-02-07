// ===== ЭЛЕМЕНТЫ =====
const questionImage = document.getElementById("question-image");
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
const PASSWORD_HASH = "54cf4e60deae7f2028893d71a104f0e2b8f2ac43e4559685eac5b80ffaab5e1c";

const questions = [
  { question: "这位俄罗斯流行歌星有多少孩子?", answer: 2 },
  { question: "Add to the year of your birth the age at which people legally start drinking in America (and already trying to stop drinking in Russia) 😊", answer: 2026 },
  { question: "Daniel Ocean a déjà Onze amis.Ajoute Les Beatles. Combien sont-ils maintenant?", answer: 15 }
];

let currentStep = Number(localStorage.getItem("step")) || 0;

// ===== ФУНКЦИИ =====

// Плавное переключение экранов
function switchScreen(from, to) {
  from.classList.remove("active");
  setTimeout(() => {
    to.classList.add("active");
  }, 50);
}

// SHA-256 хэширование
async function hash(str) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Проверка пароля
async function checkPassword() {
  const hashed = await hash(passwordInput.value.trim());
  if (hashed === PASSWORD_HASH) {
    passwordError.textContent = "";
    switchScreen(passwordScreen, quizScreen);
    showQuiz();
  } else {
    passwordError.textContent = "Неверный пароль 💔";
  }
}

// Показываем текущую загадку
function showQuiz() {
  if (currentStep >= questions.length) {
    showFinal();
    return;
  }
  questionTitle.textContent = questions[currentStep].question;
  answerInput.value = "";
  answerError.textContent = "";



  if (currentStep === 0) {
    questionImage.src = "phill.png"; // путь к картинке
    questionImage.style.display = "block";
  } else {
    questionImage.style.display = "none";
  }


  updateDateProgress();
}

// ✅ Проверка ответа на загадку (с паузой после последнего ответа)
function submitAnswer() {
  const value = answerInput.value.trim();
  if (!value) return;

  const expected = Number(questions[currentStep].answer);
  const given = Number(value);

  if (given === expected) {
    currentStep++;
    localStorage.setItem("step", currentStep);
    answerError.textContent = "";

    // Если это был последний ответ — даём дате "пожить" секунду
    if (currentStep >= questions.length) {
      updateDateProgress(); // чтобы сразу отрисовалась собранная дата
      answerInput.blur();   // чисто чтобы на мобиле клавиатура не мешала (по желанию)

      setTimeout(() => {
        showQuiz(); // showQuiz увидит, что шагов больше нет, и вызовет showFinal()
      }, 1000);
      return;
    }

    showQuiz();
  } else {
    answerError.textContent = "Подумай ещё 😉";
  }
}

// Обновление прогресса даты (месяц -> год -> день)
function updateDateProgress() {
  // по умолчанию пусто
  dayEl.textContent = "__";
  monthEl.textContent = "__";
  yearEl.textContent = "____";

  dayEl.classList.remove("filled");
  monthEl.classList.remove("filled");
  yearEl.classList.remove("filled");

  // 1-я загадка → месяц (центр)
  if (currentStep >= 1) {
    monthEl.textContent = "02";
    monthEl.classList.add("filled");
  }

  // 2-я загадка → год
  if (currentStep >= 2) {
    yearEl.textContent = "2026";
    yearEl.classList.add("filled");
  }

  // 3-я загадка → день
  if (currentStep >= 3) {
    dayEl.textContent = "15";
    dayEl.classList.add("filled");
  }
}

// Финальный экран
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

// Автозапуск, если уже есть прогресс
if (currentStep > 0) {
  passwordScreen.classList.remove("active");
  quizScreen.classList.add("active");
  showQuiz();
}