/* Jeopardy Game Logic */
// Kenneth Postigo, July 2018

// uses the jservice API to get trivia questions
// using http://jservice.io/


////////////////////////////////////////////
/////////////// Variables //////////////////
////////////////////////////////////////////

// giphy api url + key
// docs : https://developers.giphy.com/docs/
var gifURL = '',
    gifKEY = 'gmUoQcltu2OqZuLZ9RXHRKoT7hR8CHrk';
// jservice categories
const category_quant = 3;

// get 20 categories
var catergories_url = 'http://jservice.io/api/categories?count=20';

// easy access vars
var start = $(".start");

////////////////////////////////////////////
//////////////// Utility ///////////////////
////////////////////////////////////////////

function randomize(min, max)){
  return Math.floor(Math.random() * ( max - min + 1) + min);
}


////////////////////////////////////////////
//////////////// Functions /////////////////
////////////////////////////////////////////

$(".start-btn").on('click', function() {
// remove start button and show category options

  $(".start-btn").remove();   // remove play button

  // get categories from api
  $.ajax({
    url : catergories_url,
    method : 'GET'
  }).then( function(categories) {
    for (let i=0; i < category_quant; i++){
      // create button element
      let btn = $('<button>');

      // choose 3 random categories from 20 

      // add attributes to button
      btn.attr({
        type : 'button',
        class : 'btn btn-small btn-dark mx-2'
      });
      // add category title to button text and append to .start div
      btn.text(categories[i].title);
      start.append(btn).hide().fadeIn();
    };
  });
});
