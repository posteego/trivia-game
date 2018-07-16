/* Trivia Game Logic */
// Kenneth Postigo, July 2018

$(function() {
// hide .game div on page load
  $(".game").hide();
});

$(".start-btn").on('click', function() {
// show game when play button gets clicked
  $(".start").remove();   // remove play button
  $(".game").show();      // show .game div
});

////////////////////////////////////////////
/////////////// Variables //////////////////
////////////////////////////////////////////

// giphy api url + key
// docs : https://developers.giphy.com/docs/
var gifURL = '';
var gifKEY = 'gmUoQcltu2OqZuLZ9RXHRKoT7hR8CHrk';

// question/choice/answer objects
var questions = [
    {
      question : '?',
      choices: [''],
      answer: 0
    },

    {
      question : '?',
      choices: [''],
      answer: 0
    },

    {
      question : '?',
      choices: [''],
      answer: 0
    },

    {
      question : '?',
      choices: [''],
      answer: 0
    }
];


////////////////////////////////////////////
//////////////// Utility ///////////////////
////////////////////////////////////////////

function randomize(min, max){
  return Math.floor(Math.random() * ( max - min + 1) + min);
}

