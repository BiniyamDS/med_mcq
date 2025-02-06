let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let allQuestions = [];

document.addEventListener("DOMContentLoaded", () => {
  loadQuestions("data.json");

  document
    .getElementById("question-type")
    .addEventListener("change", (event) => {
      loadQuestions(event.target.value);
    });

  document.getElementById("category").addEventListener("change", (event) => {
    filterQuestionsByCategory(event.target.value);
  });

  document.getElementById("check-btn").addEventListener("click", () => {
    checkAnswer();
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuestion();
    }
  });

  document.getElementById("skip-btn").addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      loadQuestion();
    }
  });

  document.getElementById("jump-btn").addEventListener("click", () => {
    const questionNumber = parseInt(
      document.getElementById("question-number").value
    );
    if (questionNumber > 0 && questionNumber <= questions.length) {
      currentQuestionIndex = questionNumber - 1;
      loadQuestion();
    }
  });
});

function loadQuestions(file) {
  fetch(file)
    .then((response) => response.json())
    .then((data) => {
      allQuestions = data;
      questions = allQuestions;
      currentQuestionIndex = 0;
      populateCategories();
      loadQuestion();
    })
    .catch((error) => {
      console.error("Error loading questions:", error);
    });
}

function populateCategories() {
  const categorySelect = document.getElementById("category");
  categorySelect.innerHTML = "<option value=''>All</option>";
  const topics = new Set();
  allQuestions.forEach((question) => {
    if (question.topic) {
      topics.add(question.topic);
    }
  });
  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    categorySelect.appendChild(option);
  });
}

function filterQuestionsByCategory(category) {
  if (category === "") {
    questions = allQuestions;
  } else {
    questions = allQuestions.filter(
      (question) => question.topic === category
    );
  }
  currentQuestionIndex = 0;
  loadQuestion();
}

function loadQuestion() {
  if (questions.length === 0) {
    document.getElementById("question").textContent = "No questions available.";
    document.getElementById("choices").innerHTML = "";
    return;
  }
  const question = questions[currentQuestionIndex];
  document.getElementById("question").textContent = `${
    currentQuestionIndex + 1
  }. ${question.question}`;
  const choicesList = document.getElementById("choices");
  choicesList.innerHTML = "";
  question.choices.forEach((choice, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<input type="radio" name="choice" value="${choice}" id="choice${index}">
                        <label for="choice${index}">${choice}</label>`;
    choicesList.appendChild(li);
  });
  document.getElementById("result").textContent = "";
  document.getElementById("result").classList.remove("wrong", "correct");
}

function checkAnswer() {
  const selectedChoice = document.querySelector('input[name="choice"]:checked');
  if (selectedChoice) {
    const answer = selectedChoice.value;
    const correctAnswer = questions[currentQuestionIndex].answer;
    const resultElement = document.getElementById("result");
    if (answer === correctAnswer) {
      resultElement.textContent = "Correct!";
      resultElement.classList.add("correct");
      resultElement.classList.remove("wrong");
    } else {
      resultElement.textContent = `Wrong! The correct answer is: ${correctAnswer}`;
      resultElement.classList.add("wrong");
      resultElement.classList.remove("correct");
    }
    userAnswers[currentQuestionIndex] = answer;
  }
}
