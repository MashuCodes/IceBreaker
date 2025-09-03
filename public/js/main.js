import { questions } from "./questions.js";

const generatebtn = document.getElementById(generateBtn);
const generatebox = document.getElementById(questionBox);

// Function to get a random question
function getRandomQuestion()
{
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions [randomIndex];
}

// Event listener for button click
generateBtn.addEventListener("click", () => {
  const question = getRandomQuestion();
  questionBox.textContent = question;
});