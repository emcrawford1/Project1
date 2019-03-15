
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


//This function performs an ajax call to Yelp using the business id.  This ajax call returns information such as business hours for the specific 
//restaurant.

// function getBusinessHours(id) {

//     var busHoursURL = "https://api.yelp.com/v3/businesses/" + id;
//     console.log('does stuff', id);
//     console.log(busHoursURL);

//     $.ajax({
//         url: proxyURL + busHoursURL,
//         method: "GET",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader('Authorization', 'Bearer R0lQ1MRLKKrC83brhVmjZ6grB1ExTxiuQvIOCVfpq2jZN_2BsKcAvkq-oA98Z6gqa7zUszdE8BtXMvkLB6HvQ5M7f4ThNh6NHuAfjtsxeF7pge-EUAFkPMd_ARGEXHYx');
//         }

//     }).then(function (busHoursResponse) {

//         postDetailsToDOM(busHoursResponse);

//     })

// }

//This function performs an ajax call to Yelp using the zip code or city name and returns a list of restaurants along with other misc data (i.e. rating, number of 
//ratings, cost, etc.)
var yelpResponse;

function getYelpResults(searchType, key, searchParam_1, searchParam_2) {
    var queryURL = "https://api.yelp.com/v3" + searchType + key + searchParam_1 + searchParam_2;

    $.ajax({
        url: proxyURL + queryURL,
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

    apiResponse.businesses.forEach(function(val, idx) {
        
        var business = $("<div>").attr('id', idx).attr('data-yelp-id', val.id)
        .addClass('box')
        .addClass('businessListing');

        var container = $('<div>').addClass('columns');

        // score and price column
        var restPrice = $('<span>').addClass('tag is-medium').text(val.price);
        var restRating = $('<span>').addClass('tag is-black').text(val.rating);
        var restRatingCount = $('<p>').addClass('is-size-7').text(val.review_count);
        var rating = $('<div>').append(restRating, restRatingCount)
        var ratingPriceContainer = $('<div>').addClass('column').append(rating, restPrice);


        var restName = $('<h2>').addClass('title is-4').text(val.name);
        var restAddr = $('<p>').addClass('subtitle is-5')
        .text(val.location.display_address);

        var restDeets = $('<div>').addClass('column is-four-fifths');
        restDeets.append(restName, restAddr);        

        var selectedIndicator = $('<div>').addClass('column').text('x');

        business.append(ratingPriceContainer, restDeets, selectedIndicator);

        $('#yelp-results').find('.container').append(business);

    
    })
    

}


//This function posts the details of each business id (at this point it is just hours the business is open).  
//Since I am unsure of where we will want to implement this in the DOM, I simply console logged the hours.  It
//should be easy enough to convert each console log to a DOM manipulation if we choose.

// function postDetailsToDOM(busDetails) {

//     var dayArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

//     var openDay = 0;

//     for (var i = 0; i < dayArray.length; i++) {

//         if (i <= busDetails.hours[0].open[busDetails.hours[0].open.length - 1].day) {

//             if (i === busDetails.hours[0].open[openDay].day) {

//                 console.log(dayArray[busDetails.hours[0].open[openDay].day] + ":");
//                 console.log("Opens: " + busDetails.hours[0].open[openDay].start);
//                 console.log("Closes: " + busDetails.hours[0].open[openDay].end);
//                 console.log("");
//                 openDay++;
//             }

//             else {

//                 console.log(dayArray[i] + ": closed");
//                 console.log("");
//             }

//         }
//         else {
//             console.log(dayArray[i] + ": closed");
//             console.log("");
//         }
//     }

// }

// //This function converts the hours the business is open from military time to nonmilitary time.  It does not currently 
//work.  Modifications will need to be made before it is implemented (the splice function does not work on a string).

// function convertHours(convertThisTime) {

//     var convertedTime = "";
//     var firstTwoChar = convertThisTime.toString().slice(0, 2);
//     meridianComp = parseInt(firstTwoChar);

//     if (meridianComp > 11) {
//         convertThisTime += " PM";
//     }
//     else {
//         convertThisTime += " AM";
//     }

//     if(meridianComp > 12){
//         meridianComp -= 12;
//     }

//     var merConv = meridianComp.toString();

//     convertThisTime.splice(0,2,merConv);

//     return convertThisTime;


// }


$(document).on('click', '#location-search', function(e) {
    e.preventDefault();
    var citySearch = $('#event-location').val().trim();
    getYelpResults(businessSearch, apiKey, locationURL, citySearch);
    $("#yelp-results").addClass('is-active')
})

$(document).on('click', '.modal-close', function(e) {
    e.preventDefault();
    $('.modal').removeClass('is-active');
})

$(document).on('click', '.modal-background', function() {
    $('.modal').removeClass('is-active');
})

$(document).on('click', '.businessListing', function() {
    $('.businessListing').removeClass('selected');
    $(this).toggleClass('selected');
})