let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let allQuestions = [];

document.addEventListener("DOMContentLoaded", () => {
    loadQuestions("data.json");

    document.getElementById("question-type").addEventListener("change", (event) => {
        loadQuestions(event.target.value);
    });

    document.getElementById("category").addEventListener("change", (event) => {
        filterQuestionsByCategory(event.target.value);
    });

    document.getElementById("check-btn").addEventListener("click", checkAnswer);
    document.getElementById("prev-btn").addEventListener("click", previousQuestion);
    document.getElementById("skip-btn").addEventListener("click", nextQuestion);
    document.getElementById("jump-btn").addEventListener("click", jumpToQuestion);
});

function loadQuestions(file) {
    fetch(file)
        .then((response) => response.json())
        .then((data) => {
            allQuestions = data;
            questions = allQuestions;
            currentQuestionIndex = 0;
            populateCategories();
            updateProgress();
            loadQuestion();
        })
        .catch(console.error);
}

function populateCategories() {
    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML = "<option value=''>All</option>";
    const categories = [...new Set(allQuestions.map(q => q.topic))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function filterQuestionsByCategory(category) {
    questions = category ? allQuestions.filter(q => q.topic === category) : allQuestions;
    currentQuestionIndex = 0;
    updateProgress();
    loadQuestion();
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    const choicesContainer = document.getElementById("choices");
    
    document.getElementById("question").textContent = question.question;
    document.getElementById("current-question").textContent = currentQuestionIndex + 1;
    choicesContainer.innerHTML = '';

    question.choices.forEach((choice, index) => {
        const label = document.createElement("label");
        label.innerHTML = `
            <input type="radio" name="choice" value="${choice}">
            ${choice}
        `;
        choicesContainer.appendChild(label);
    });

    document.getElementById("result").className = "";
    document.getElementById("result").textContent = "";
    updateProgress();
}

function checkAnswer() {
    const selected = document.querySelector('input[name="choice"]:checked');
    const resultElement = document.getElementById("result");
    const choices = document.querySelectorAll('#choices label');
    
    if (!selected) return;

    const isCorrect = selected.value === questions[currentQuestionIndex].answer;
    choices.forEach(choice => {
        const input = choice.querySelector('input');
        if (input.value === questions[currentQuestionIndex].answer) {
            choice.classList.add('correct');
        } else if (input.checked) {
            choice.classList.add('wrong');
        } else {
            choice.classList.add('inactive');
        }
        input.disabled = true;
    });

    // ...existing code to display result if needed...
    
    // Change button to "Next Question" mode.
    const btn = document.getElementById("check-btn");
    btn.textContent = "Next Question";
    btn.removeEventListener("click", checkAnswer);
    btn.addEventListener("click", nextQuestionAndReset);
}

function nextQuestionAndReset() {
    const btn = document.getElementById("check-btn");
    nextQuestion();
    btn.textContent = "Check Answer";
    btn.removeEventListener("click", nextQuestionAndReset);
    btn.addEventListener("click", checkAnswer);
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
}

function jumpToQuestion() {
    const input = document.getElementById("question-number");
    const num = parseInt(input.value);
    if (num >= 1 && num <= questions.length) {
        currentQuestionIndex = num - 1;
        loadQuestion();
    }
}

function updateProgress() {
    document.getElementById("progress-count").textContent = currentQuestionIndex + 1;
    document.getElementById("total-questions").textContent = questions.length;
}