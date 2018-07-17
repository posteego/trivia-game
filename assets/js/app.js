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
var start = $(".start");

////////////////////////////////////////////
//////////////// Utility ///////////////////
////////////////////////////////////////////

function randomize(min, max){
  return Math.floor(Math.random() * ( max - min + 1) + min);
}


////////////////////////////////////////////
//////////////// Functions /////////////////
////////////////////////////////////////////

$(".start-btn").on('click', function() {
// remove start button and show category options

  $(".start-btn").remove();   // remove play button

  // get categories from api
  var catergories_url = 'http://jservice.io/api/categories?count=3';
  $.ajax({
    url : catergories_url,
    method : 'GET'
  }).then( function(categories) {
    let btn = $('<button>');
    btn.attr('type','button');

    for (i in categories){
      btn.text(categories[i].title);
      btn.prependTo(start);
    }
  });
});
