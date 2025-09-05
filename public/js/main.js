import { questions } from "./questions.js";
import { setTimer, startTimer } from "./timer.js";

document.addEventListener("DOMContentLoaded", () => {
  // Grab all the buttons and display elements from the page
  const generateBtn = document.getElementById("generateBtn");
  const questionBox = document.getElementById("questionBox");
  const categoryBox = document.getElementById("categoryBox");
  const funnyBtn = document.getElementById("funnyBtn");
  const deepBtn = document.getElementById("deepBtn");
  const rapidBtn = document.getElementById("rapidBtn");
  const imageBox = document.getElementById("imageBox");

  // Pick a random question from the given category
  function getRandomQuestion(category) {
    const categoryQuestions = questions[category];
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    return categoryQuestions[randomIndex];
  }

  // Show a question and handle Rapid Fire timer if needed
  function handleQuestion(category) {
    categoryBox.textContent = `Category: ${category}`;
    questionBox.textContent = getRandomQuestion(category);

    if (category === "Funny"){
      imageBox.innerHTML= '<img src="public/images/pose_dance_ukareru_man.png" style="max-height:200px; float:right; margin:10px;">';
    }
    else if (category === "Deep"){
      imageBox.innerHTML= '<img src="public/images/shinkai_nyudoukajika.png" style="max-height:200px; float:right; margin:10px;">';
    }
    else if (category === "RapidFire"){
      imageBox.innerHTML= '<img src = "public/images/bird_kubinaga_kaitsuburi.png" style="max-height:200px; float:right; margin:10px;">';
    }
    else{
      imageBox.innerHTML=""
    }

    if (category === "RapidFire") {
      setTimer(5);   // Rapid Fire: set timer to 5 seconds
      startTimer();   // Start countdown automatically
    } else {
      setTimer(0);   // Stop timer for other categories
    }
  }

  // Random question button: picks any category randomly
  generateBtn.addEventListener("click", () => {
    const categories = Object.keys(questions);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    handleQuestion(randomCategory);
  });

  // Individual category buttons
  funnyBtn.addEventListener("click", () => handleQuestion("Funny"));
  deepBtn.addEventListener("click", () => handleQuestion("Deep"));
  rapidBtn.addEventListener("click", () => handleQuestion("RapidFire"));
});