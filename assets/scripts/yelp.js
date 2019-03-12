
//Client ID
//OlSbv5g2sw7BGvrg40hgqg

//API Key
//R0lQ1MRLKKrC83brhVmjZ6grB1ExTxiuQvIOCVfpq2jZN_2BsKcAvkq-oA98Z6gqa7zUszdE8BtXMvkLB6HvQ5M7f4ThNh6NHuAfjtsxeF7pge-EUAFkPMd_ARGEXHYx




//Global variables

var businessSearch = "/businesses/search?";
var apiKey = "API_KEY=R0lQ1MRLKKrC83brhVmjZ6grB1ExTxiuQvIOCVfpq2jZN_2BsKcAvkq-oA98Z6gqa7zUszdE8BtXMvkLB6HvQ5M7f4ThNh6NHuAfjtsxeF7pge-EUAFkPMd_ARGEXHYx";
var locationURL = "&location="
var locationCity = "37209";
var proxyURL = "https://cors-anywhere.herokuapp.com/"



//Function for interacting with Yelp api and returning the results

function getYelpResults(boolFlag, searchType, key, searchParam_1, searchParam_2) {
    var queryURL = "https://api.yelp.com/v3" + searchType + key + searchParam_1 + searchParam_2;

    console.log(queryURL);

    $.ajax({
        url: proxyURL + queryURL,
        method: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer R0lQ1MRLKKrC83brhVmjZ6grB1ExTxiuQvIOCVfpq2jZN_2BsKcAvkq-oA98Z6gqa7zUszdE8BtXMvkLB6HvQ5M7f4ThNh6NHuAfjtsxeF7pge-EUAFkPMd_ARGEXHYx');
        }

    }).then(function (response) {

        console.log(response);

        if(boolFlag){

       postToDOM(response);

        }

        else{

            return response;
        }

    })
}


//Function for posting the yelp responses to the DOM

function postToDOM(apiResponse) {




    var todaysDate = new Date();
    var today = todaysDate.getDay();

    for (var i = 0; i < apiResponse.businesses.length; i++) {

        var newRow = $("<tr>").append(
            $("<td>").text(apiResponse.businesses[i].name),
            $("<td>").text(apiResponse.businesses[i].display_phone),
            $("<td>").text(apiResponse.businesses[i].rating),
            $("<td>").text(apiResponse.businesses[i].review_count),
            $("<td>").text(apiResponse.businesses[i].price)
        )

        $('#yelp-results').append(newRow);
    }

}


$(window).on("load", function () {

     var apiResponse = getYelpResults(true, businessSearch, apiKey, locationURL, locationCity);
     

})