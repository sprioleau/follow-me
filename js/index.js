// Select elements
const gameButtons = document.querySelectorAll(".game__button");
const gameController = document.querySelector(".game__controller");
const greenButton = document.querySelector("[data-color=green]");
const redButton = document.querySelector("[data-color=red]");
const yellowButton = document.querySelector("[data-color=yellow]");
const blueButton = document.querySelector("[data-color=blue]");
const scoreText = document.querySelector(".scoreboard__score");
const startButton = document.querySelector(".start");
const resetButton = document.querySelector(".reset");
const instructionsText = document.querySelector(".instructions");

// Source: https://www.memozor.com/jeux/new_games/sounds/simon/original_simon_sprite_min.mp3
const gameSounds = new Audio("../assets/mimi-sounds.mp3");

const buttons = {
  green : greenButton ,
  red   : redButton   ,
  yellow: yellowButton,
  blue  : blueButton  ,
}

const speed = {
  fast: 0.5,
  normal: 1,
  relaxed: 1.5
}

const startTimes = {
  green : 0.5 ,
  red   : 1.25,
  yellow: 2   ,
  blue  : 2.7 ,
}

// Variables
let score = 0;
let isPlaying = false;
let isTeaching = false;
let gameIsStarted = false;
let options = ["green", "red", "yellow", "blue"];
let sequence = [];
let playerSequence = [];

function playGameOverSound() {
  gameSounds.currentTime = 3.75;
  gameSounds.play();
}

function playButtonSound(sound) {
  gameSounds.currentTime = startTimes[sound];
  gameSounds.play();
  setTimeout(() => gameSounds.pause(), 500);
}

function setActive(button) {
  button.classList.add("active");
  button.style.pointerEvents = "none";
}

function setInactive(button) {
  button.classList.remove("active");
  button.style.pointerEvents = "all";
}

function toggleActive(selectedButton) {
  setActive(selectedButton);
  playButtonSound(selectedButton.dataset.color);
  setTimeout(() => setInactive(selectedButton), 100);
}

function getRandomEntry() {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

async function wait(seconds) {
  return new Promise(function(resolve) {
    setTimeout(resolve, seconds * 1000);
  })
}

async function showNextItemInSequence(i, sequence) {
  await wait(1 * i);
  toggleActive(buttons[sequence[i]]);
}

async function playSequence(sequence) {
  await wait(1);

  for (let i = 0; i < sequence.length; i++) {
    showNextItemInSequence(i, sequence);
  }

  isTeaching = false;
  isPlaying = true;

  await wait(1);
  instructionsText.textContent = "Play!";
}

function teachNextSequence() {
  console.log("🧮 teaching next sequence")
  isTeaching = true;
  isPlaying = false;
  instructionsText.textContent = "Watch!";

  const nextEntry = getRandomEntry(options);
  sequence.push(nextEntry);
  console.log('🗣 sequence:', sequence.join(", "));
  playSequence(sequence);
  playerSequence = [];
}

async function checkSequence(index) {
  if (playerSequence.length < sequence.length && playerSequence[index] === sequence[index]) {
    console.log('Correct entry, 🚶🏾 exiting checkSequence():')

    return;
  }
  
  if (playerSequence.length === sequence.length) {
    console.log('🤓 teaching next sequence:', playerSequence.length === sequence.length)
    score += 10;
    scoreText.textContent = score;

    await wait(1);

    return teachNextSequence();
  }
  
  gameOver();
}


function handleButtonClick(e) {
  if (!isPlaying || isTeaching) return;
  const selectedColor = e.target.dataset.color;
  const nextIndex = playerSequence.length;
  toggleActive(e.target);
  playerSequence[nextIndex] = selectedColor
  console.log('🤔 playerSequence:', playerSequence.join(", "));

  checkSequence(nextIndex);
  // checkColorAtIndex(nextIndex)
}

function startGame() {
  console.log("🎮 game started");
  startButton.classList.add("hide");
  resetButton.classList.remove("hide");
  teachNextSequence();
};

function resetGame() {
  sequence = [];
  playerSequence = [];
  console.clear();
  score = 0;
  resetButton.classList.add("hide");
  startButton.classList.remove("hide");
}

function gameOver() {
  console.log("👾 Game over!")
  playGameOverSound();
  startButton.classList.remove("hide");
}

// Add Event Listeners
gameButtons.forEach((button) => {
  button.addEventListener("click", handleButtonClick)
});

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);