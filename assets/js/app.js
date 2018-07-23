/* Trivia Game Logic */
// Kenneth Postigo, July 2018

// uses the OpenTDB API to get trivia questions
// using https://opentdb.com/


////////////////////////////////////////////
/////////////// Variables //////////////////
////////////////////////////////////////////

// giphy api url + key
// docs : https://developers.giphy.com/docs/
var gifURL = '',
    gifKEY = 'gmUoQcltu2OqZuLZ9RXHRKoT7hR8CHrk';

// opentdb api urls
const general = "https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple",
  
  art = "https://opentdb.com/api.php?amount=5&category=25&difficulty=medium&type=multiple",
  
  celebrity = "https://opentdb.com/api.php?amount=5&category=26&difficulty=medium&type=multiple";

// easy access vars
var start = $(".start"),
  q_div = $(".question"),
  choice_div = $(".choices"),
  p = $("<p>"),
  s = $("<span>"),
  t = $("<p><b>");
  log = console.log;

// timer, counters, other vars
var time = 60, // 60 seconds
  timer,
  correct = 0,
  incorrect = 0,
  questions = [],
  choices = [],
  random_choices = [];


// keeps track of start,mid,end game (0,1,2) and question/answer
var index = 0,
  last = 0,
  gameData = {
    step: 0,
    question: index,
    answer: index * 4,
    choiceMax: (index * 4) + 4,
    answered: false,
    last: false
};


////////////////////////////////////////////
//////////////// Utility ///////////////////
////////////////////////////////////////////

function randomize(num, min) {
// randomize list of numbers and store in random_choices array
  while (random_choices.length < num) {
    // set random number
    let randomnumber = Math.floor(Math.random() * (num - min + 1) + min);

    // check if repeat
    if (random_choices.indexOf(randomnumber) > -1) continue;

    // otherwise add index (randomnumber) to array
    random_choices[random_choices.length] = randomnumber;
  }

}

function runTimer() {
// run the timer
  // start timer
  timer = setInterval(awaitChoices(), 1000);
}

function awaitChoices() {
  time--;
  if (time === 0) {
    // do something
  }

  t.html(time);
}

function display() {
  switch (gameData.step) {
    case 0:
      // remove category choices
      $(".start").remove();
      break;
    
    case 1:
      // increase question index if the question was answered
      if (gameData.answered === true) {
        index++;
        gameData.question = index;
        gameData.answer = index * 4;
      }

      // switch to end game state if on last question
      gameData.last = (index === last) ? true : false;

      // display timer
      t = $("<p><b>");
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

      // add choices to display
      randomize(gameData.choiceMax, gameData.answer);
      for (let i = 0; i < random_choices.length; i++){
        let button = $("<button>");
        button.attr({
          id: 'choice' + i,
          class: 'btn btn-light btn-block mx-2'
        });
        button.html(choices[random_choices[i]]);
        button.appendTo(choice_div);
      }

      runTimer();
      break;
    
    case 2:
      break;
  }
}


////////////////////////////////////////////
//////////////// Functions /////////////////
////////////////////////////////////////////
  
$(".game-btn").on('click', function () {
// category chosen
  
  // update display
  display();
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
    display();
  });

}