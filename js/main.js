/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
const toggleBtn = document.querySelector('.navbar__toggleBtn');
const menu = document.querySelector('.navbar__menu');
const icons = document.querySelector('.navbar__icons');

toggleBtn.addEventListener('click', () => {
  menu.classList.toggle('active');
  icons.classList.toggle('active');
});



//global variables
const guessedLetterElement = document.querySelector(".guessed-letters");// list where players guessed letters will appear
const guessButton = document.querySelector(".guess");//button 
const guessForm = document.querySelector(".letter"); //entry form for players to enter letters
const remainingGuessesElement = document.querySelector(".remaining");//paragraph where remaining guesses will appear
const wordProgress = document.querySelector(".word-in-progress")// where guessed correctly guessed letters form word
const remainingGuessSpan = document.querySelector(".remaining span");//number of guess remaining span
const messageForGuess = document.querySelector(".message");
const playAgain = document.querySelector(".play-again");//button that will appear to prompt new game

let word = "magnolia";//orginal word before api generator added
let guessedLetters = [];//empty array for player's guesses
let remainingGuesses = "8";
//console.log(remainingGuesses);

//async function to fetch api that will generate word for game
const getWord = async function(){
  const res = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
  const data = await res.text();
  const wordArray = data.split("\n");
  //delimiter to create array from text file
  console.log(wordArray);
  const randomWord = Math.floor(Math.random() * wordArray.length);
  word = wordArray[randomWord].trim();
  placeholder(word);
}

getWord();



//function to add placeholder symbols for each individual letter
const placeholder = function (word) {
  const placeholderLetters = [];
    for (const letter of word) {
      //console.log(letter);
      placeholderLetters.push("●");
    }
  wordProgress.innerText = placeholderLetters.join("");
};
  



//event listener for button click
guessButton.addEventListener("click", function (e) {
  e.preventDefault();
  //this overides default button reloading behavior
  messageForGuess.innerText = "";
  const guess = guessForm.value;
  const goodGuess = validateInput(guess);

  if (goodGuess){
      makeGuess(guess);
  };
  guessForm.value = "";
});



//function to check player's input in form
const validateInput = function(input){
  const acceptedLetter = /[a-zA-Z]/; 
  //regular expression
  if ( input.length === 0){ 
    messageForGuess.innerText ="Please enter a letter.";
  } else if(input.length > 1) { 
    messageForGuess.innerText = "Please enter single letter.";
  } else if(!input.match(acceptedLetter)){
    messageForGuess.innerText = "Please enter a letter from A-Z."
  }else {
  return input;
  //conditions met player has entered an accepted input
  }
};

const makeGuess = function(guess){
  guess = guess.toUpperCase();
  if (guessedLetters.includes(guess)){
    messageForGuess.innerText = "You already guessed this letter";
  }else{
    guessedLetters.push(guess);
    console.log(guessedLetters);
    countRemainingGuesses(guess);
    displayGuessedLetters();
    updateWordInProgress(guessedLetters);
  }
}

//function to show guessed letters
const displayGuessedLetters = function(){
  guessedLetterElement.innerHTML = "";
  for (const letter of guessedLetters){
    const li = document.createElement("li");
    li.innerText = letter;
    guessedLetterElement.append(li);
  }
};

//function to update word in progress

const updateWordInProgress = function(guessedLetters){
  const wordUpper = word.toUpperCase();
  const wordArray = wordUpper.split("");
  //splits word into an array so that letters can appear in the guessedLetters array
  console.log(wordArray);
  const revealWord = [];
  for (const letter of wordArray){
    if (guessedLetters.includes(letter)){
      revealWord.push(letter.toUpperCase());
    }else{
      revealWord.push("●");
    }
  }
  //console.log(revealWord);
  wordProgress.innerText =revealWord.join("");
  checkIfWin();
};

//Function to update the remaining guesses
const countRemainingGuesses = function(guess){
  const upperWord = word.toUpperCase();
  if(!upperWord.includes(guess)){
    messageForGuess.innerText =`Sorry, the word does not have a ${guess}.`;
    remainingGuesses -= 1 ;
  }else{
    messageForGuess.innerText= `The word has a ${guess}!`;
  }

  if (remainingGuesses === 0){
    messageForGuess.innerHTML=`Game over! The word was <span class="highlight"> ${word} </span>.`;
  } else if (guessedLetters === 1){
    remainingGuessSpan.innerText= `${remainingGuesses}guess!`;
  }else{
    remainingGuessSpan.innerText= `${remainingGuesses} guesses`;
  }
};


//function to check if player won
const checkIfWin = function(){
  if(word.toUpperCase() === wordProgress.innerText){
    messageForGuess.classList.add("win");
    messageForGuess.innerHTML = `<p class="highlight">You guessed the correct word! Congrats!</p>`;

    startAgain();
  }
}

//function to hide guess button and display play again button at the end of the game

const startAgain = function(){
  guessButton.classList.add("hide");
  remainingGuessesElement.classList.add("hide");
  guessedLetterElement.classList.add("hide");
  playAgain.classList.remove("hide");
};

playAgain.addEventListener("click", function () {
  // reset all original values - grab new word
  messageForGuess.classList.remove("win");
  guessedLetters = [];
  remainingGuesses = 8;
  remainingGuessSpan.innerText = `${remainingGuesses} guesses`;
  guessedLetterElement.innerHTML = "";
  messageForGuess.innerText = "";
  // Grab a new word
  getWord();

  // show the right UI elements
  guessButton.classList.remove("hide");
  playAgain.classList.add("hide");
  remainingGuessesElement.classList.remove("hide");
  guessedLetterElement.classList.remove("hide");
});

