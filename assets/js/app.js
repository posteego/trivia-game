/* Trivia Game Logic */
// Kenneth Postigo, July 2018

// uses the OpenTDB API to get trivia questions
// using https://opentdb.com/


////////////////////////////////////////////
/////////////// Variables //////////////////
////////////////////////////////////////////

// opentdb api urls
const general = "https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple",

  art = "https://opentdb.com/api.php?amount=5&category=25&difficulty=medium&type=multiple",

  celebrity = "https://opentdb.com/api.php?amount=5&category=26&difficulty=medium&type=multiple";

// easy access vars
// terrible variable names lol
var start = $(".start"),
  q_div = $(".question"),
  choice_div = $(".choices"),
  choice_btn = $("button"),
  p = $("<p>"),
  s = $("<span>"),
  t = $("<p><b>"),
  log = console.log;

// timer, counters, other vars
var time = 60, // 60 seconds
  duration = 0,
  timer,
  questions = [],
  choices = [],
  random_choices = [];


// keeps track of start,mid,end game (0,1,2) and question/answer
var index = 0,
  last = 0,
  gameData = {
    step: 0,
    question: index,    // use index var here for
    answer: index * 4,  // formula reference
    choiceMax: (index * 4) + 4, // here too
    correct: 0,
    incorrect: 0,
    answered: false,
    last: false,
    winner: false
  };


////////////////////////////////////////////
//////////////// Utility ///////////////////
////////////////////////////////////////////

function randomize(num, min) {
// randomize list of numbers and store in random_choices array
  while (random_choices.length < 4) {   // only want 4 numbers in the array
    // set random number
    let randomnumber = Math.floor(Math.random() * (num - min) + min);

    // check if repeat
    if (random_choices.indexOf(randomnumber) > -1) continue;

    // otherwise add index (randomnumber) to array
    random_choices[random_choices.length] = randomnumber;
  }
}


function runTimer() {
// run the timer
  timer = setInterval(awaitChoices, 1000);
}


function awaitChoices() {
// manages when to move on to next question or end game
  
  time--;   // subtract 1 second
  duration++; // add 1 second!
  t.html(time); // display timer

  // move to end game when time runs out
  if (time === 0) {
    // stop timer
    clearInterval(timer);
    // change to endgame
    gameData.step = 2;
    // display end game
    display();
  }
}


////////////////////////////////////////////
//////////////// Functions /////////////////
////////////////////////////////////////////

$(".game-btn").on('click', function () {
// category chosen
  display();  // update display
  // send category to startGame
  let category = $(this).attr('id');
  startGame(category);
});


function startGame(category) {
  // set url to correct category
  var url = "";

  switch (category) {
    case 'general':
      url = general;
      break;
    case 'art':
      url = art;
      break;
    case 'celebrity':
      url = celebrity;
      break;
  }
  
  // ajax call for populating questions, and choices arrays
  $.ajax({
    url: url,
    method: 'GET'
  }).then(function (response) {
    // 1 correct_answer, 3 incorrect_answers per question

    // loop through questions
    for (let i = 0; i < response.results.length; i++) {
      // push correct answer into first choice for each question after decoding
      let a = $("<p>").html(response.results[i].correct_answer).text();
      choices.push(a);

      // loop through the three incorrect answers
      for (let j = 0; j < response.results[i].incorrect_answers.length; j++) {
        // push incorrect answer into choices array after decoding
        let a = $("<p>").html(response.results[i].incorrect_answers[j]).text();
        choices.push(a);
      }
      // push the question into the questions array
      questions.push(response.results[i].question);
      // decode html entities in the string and replace
      questions[i] = $("<p>").html(questions[i]).text();
    }

    // update 'last' var to have the index of the last question
    last = questions.length - 1;
    // move to mid game
    gameData.step = 1;
    // start timer
    runTimer();
    display();
  });

}


function display() {
  // displays game start to end
  switch (gameData.step) {
    case 0:
      // remove category choices
      $(".start").remove();
      break;

    case 1:
      // switch to end game state if on last question
      gameData.last = (index === last) ? true : false;

      // increase question index if the question was answered
      if (gameData.answered === true && gameData.last === false) {
        index++;
        gameData.question = index;
        gameData.answer = index * 4;
        gameData.choiceMax = gameData.answer + 4;
        gameData.answered = false;
      } else if (gameData.answered === true && gameData.last === true) {
        // move to the end of the game (displaying score, stoping timer, etc)
        gameData.step = 2;
        display();
        break;
      }

      // display timer
      t.attr('id', 'time').html(time);
      s.html('Time Left: ').append(t);
      s.appendTo($(".timer"));

      // add question to display
      p.attr({
        id: 'question',
        class: 'lead'
      });
      p.html(questions[gameData.question]);
      p.appendTo(q_div);

      // randomize choices
      randomize(gameData.choiceMax, gameData.answer);
      // clear previous choice buttons
      choice_div.empty();

      // display choice buttons
      for (let i = 0; i < random_choices.length; i++) {
        let button = $("<button>");
        button.attr({
          id: 'choice' + i,
          class: 'btn choice btn-light btn-block mx-2'
        });
        button.html(choices[random_choices[i]]);
        button.appendTo(choice_div);
      }

      // empty random array
      random_choices = [];

      // wait for choice
      $("button").one('click', function () {
        // question was answered
        gameData.answered = true;
        // check if correct or not then give point accordingly
        if ($(this).text() === choices[gameData.answer]) {
          gameData.correct++;
        } else {
          gameData.incorrect++;
        }
        display();
      });

      break;

    case 2:
      // stop timer
      clearInterval(timer);
      // display got too long so here's a new function to display the end
      endGame();
      break;
  }
}


function endGame() {
  // make the person a winner if he gets more questions right than wrong
  gameData.winner = (gameData.correct > gameData.incorrect) ? true : false;

  // disable game!
  $(".game").fadeOut("slow");

  // wait a second for everything to fade before removing stuff
  setTimeout(function () {
    $(".game").empty();
  }, 500);

  let h = $("<h1>"),
    h2 = $("<h2>"),
    h3 = $("<h2>"),
    h4 = $("<h2>"),
    h5 = $("<h2>");
  
  // calculate score as percentage
  let score = Math.floor(gameData.correct / (gameData.incorrect + gameData.correct) * 100);

  // fill in html as necessary
  h2.attr('class', 'correct');
  h2.html('Correct: ' + gameData.correct);

  h3.attr('class', 'incorrect');
  h3.html('Incorrect: ' + gameData.incorrect);

  h4.attr('class', 'score');

  if (gameData.correct === 0 && gameData.incorrect === 0){
    h4.html('Final Score: 0%');
  } else {
    h4.html('Final Score: ' + score + '%');
  }

  h5.attr('class', 'timing');
  h5.html('The game was ' + duration + ' seconds long!');

  // set h to be correct for winner or loser
  switch (gameData.winner) {
    case true:
      h.attr('class', 'you-won');
      h.html('You Won! 😃');
      break;
    case false:
      h.attr('class', 'you-lost');
      h.html('You Lost! 😩');
      break;
  }

  // make sure game disappears and clears before appending and displaying info
  setTimeout(function () {
    $(".game").append(h);
    $(".game").append(h2);
    $(".game").append(h3);
    $(".game").append(h4);
    $(".game").append(h5);
    $(".game").fadeIn("fast");
  }, 500);

}