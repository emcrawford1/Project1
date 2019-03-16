//Client ID
//OlSbv5g2sw7BGvrg40hgqg

//API Key
//R0lQ1MRLKKrC83brhVmjZ6grB1ExTxiuQvIOCVfpq2jZN_2BsKcAvkq-oA98Z6gqa7zUszdE8BtXMvkLB6HvQ5M7f4ThNh6NHuAfjtsxeF7pge-EUAFkPMd_ARGEXHYx

//Global variables
var proxyURL = "https://cors-anywhere.herokuapp.com/"


//Global variables for the initial getYelpResults() ajax call
var businessSearch = "/businesses/search?";
var apiKey = "API_KEY=KrZjDTE7tobtXUeK3WkE6RuU8TeQHZ81YesOnKVOQn65dZV8rPjsA3ozCoi4qDDsx0N-gt9keUN2v8tX6hpJFAhmU_E07xpmKLQuqnB98mLdBjXn9VuhOzcX2gGMXHYx";
var locationURL = "&location="
var locationCity = "37209";


//Ge8UQTXpurDcvqh9sKkQUg
//KrZjDTE7tobtXUeK3WkE6RuU8TeQHZ81YesOnKVOQn65dZV8rPjsA3ozCoi4qDDsx0N-gt9keUN2v8tX6hpJFAhmU_E07xpmKLQuqnB98mLdBjXn9VuhOzcX2gGMXHYx


var yelpResponse;
var selectedYelpResponse;

function getYelpResults(searchType, key, searchParam_1, searchParam_2) {
    var queryURL = "https://api.yelp.com/v3" + searchType + key + searchParam_1 + searchParam_2;

    $.ajax({
        url: queryURL,
        method: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer KrZjDTE7tobtXUeK3WkE6RuU8TeQHZ81YesOnKVOQn65dZV8rPjsA3ozCoi4qDDsx0N-gt9keUN2v8tX6hpJFAhmU_E07xpmKLQuqnB98mLdBjXn9VuhOzcX2gGMXHYx');
        }

    }).then(function (response) {
        yelpResponse = response;
        postToDOM(yelpResponse);
    })

}


//This function posts the Yelp api results to the DOM
function postToDOM(apiResponse) {

    apiResponse.businesses.forEach(function (val, idx) {

        var business = $("<div>").attr('id', idx)
            .attr('data-yelp-id', val.id)
            .addClass('businessListing');

        var container = $('<div>').addClass('columns');

        // score and price column
        var restPrice = $('<span>')
            .addClass('tag is-medium has-text-primary')
            .text(val.price).css({
                marginTop: '1em'
            });

        var restRating = $('<span>')
            .addClass('tag is-medium is-black')
            .text(val.rating);

        var restRatingCount = $('<p>')
            .addClass('is-size-7')
            .text(val.review_count);

        var rating = $('<div>').append(restRating, restRatingCount)

        var ratingPriceContainer = $('<div>')
            .addClass('column has-text-centered')
            .append(rating, restPrice);

        var restName = $('<h2>').addClass('title is-4').text(val.name);
        var restAddr = $('<p>').addClass('subtitle is-5')
            .text(val.location.display_address[0] + ', ' + val.location.display_address[1]);

        var moreButton = $('<button>')
            .addClass('more-button')
            .addClass('button')
            .text('More');
        var selectButton = $('<button>')
            .addClass('button is-link')
            .addClass('select-button')
            .text('Select');

        var buttonContainer = $('<p>')
            .addClass('has-text-right buttons are-medium is-right')
            .append(moreButton, selectButton)
            .css({
                paddingRight: '10px'
            })

        var restDeets = $('<div>').addClass('column is-four-fifths');
        restDeets.append(restName, restAddr, buttonContainer);


        container.append(ratingPriceContainer, restDeets);

        var moreDeets = $('<div>').addClass('moreDeets')

        business.append(container, moreDeets);

        $('.listings-container').append(business);

    })

}



$(document).on('click', '#location-search', function (e) {
    e.preventDefault();
    var citySearch = $('#event-location').val().trim();
    getYelpResults(businessSearch, apiKey, locationURL, citySearch);
    $("#yelp-results").addClass('is-active')
})

$(document).on('click', '.modal-close', function (e) {
    e.preventDefault();
    $('.modal').removeClass('is-active');
})

$(document).on('click', '.modal-background', function() {
    $('.modal').removeClass('is-active');
})

$(document).on('click', '.businessListing', function () {
    $('.businessListing').removeClass('selected');
    $(this).toggleClass('selected');
})

$(document).on('click', '.modal-content', function(evt) {
   evt.stopPropagation();
})

$(document).on('click', '.more-button', function (e) {
    e.preventDefault();
    var showMore = $(this).parent().parent().parent().parent().find('.moreDeets');
    showMore.toggle();
})

$(document).on('click', '.select-button', function (e) {
    e.preventDefault();
    selectedYelpResponse = $(this).parent().parent().parent().parent().attr('id');
    $('#eventPlace').hide();
    $('#chosen-place').find('h2').text(yelpResponse.businesses[selectedYelpResponse].name);
    $('#chosen-place').show();
    $('.modal').removeClass('is-active');
})