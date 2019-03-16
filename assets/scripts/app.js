var currentUser = null;
var userEmail = null;
var userName = null;
var currentUserProf = null;
var currentLong = '';
var currentLat = '';
var currentAddress = '';

var config = {
  apiKey: "AIzaSyAl_ivk9jeCwqIPtiD0bbTBPrgiSQDa0R4",
  authDomain: "plan-it-project.firebaseapp.com",
  databaseURL: "https://plan-it-project.firebaseio.com",
  projectId: "plan-it-project",
  storageBucket: "plan-it-project.appspot.com",
  messagingSenderId: "250401634632"
};
firebase.initializeApp(config);

var database = firebase.database();

var uiConfig = {
  signInSuccessUrl: 'https://jstevens79.github.io/Project1/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    userName = user.displayName;
    userEmail = user.email;
    currentUser = user.uid;

    $('#login').hide();
    $('#profile-name').text('Hello, ' + userName + '!');
    $('#profile').show();

    var userExists = false
    database.ref('users').once('value', function (snapshot) {
      snapshot.forEach(function (childSnaphot) {
        if (childSnaphot.val().userID === currentUser) {
          currentUserProf = childSnaphot.key;
          userExists = true;
        }
      })
    }).then(function () {
      if (!userExists) {
        database.ref('users').push({
          userID: currentUser,
          userName: userName,
          userEmail: userEmail
        })
      }
    }).then(function () {
      init();
    })
  } else {
    $('#login').show();
    $('#profile').hide();
    $('#sign-out').hide();
    $('#create-event').hide();
  }
})

function init() {
  // add user cards to event add area
  database.ref('users').on('child_added', function (snapshot) {
    if (snapshot.key !== currentUserProf) {
      var friendColumn = $('<div>').addClass('column');
      var friend = $('<div>')
        .addClass('card')
        .addClass('friend')
        .attr('data-id', snapshot.key);
      var friendContent = $('<div>').addClass('card-content');
      var friendName = $('<p>').addClass('has-text-weight-bold').text(snapshot.val().userName);
      friendContent.append(friendName);
      friend.append(friendContent);
      friendColumn.append(friend)
      $('#friends-container').append(friendColumn);
    }
  })

  database.ref('events').on('child_removed', function (oldChildSnapshot) {
    $('#' + oldChildSnapshot.key).remove();
  });

  database.ref('events').on('child_changed', function (snapshot) {
    if (snapshot.val().eventMembers !== undefined) {
      var obj = snapshot.val().eventMembers;
      Object.keys(obj).forEach(function (key) {
        if (obj[key].member === currentUserProf) {
          renderEventsListItem(snapshot)
        };
      });
    }
  });

  database.ref('events').on('child_added', function (snapshot) {
    if (snapshot.val().eventMembers !== undefined) {
      var obj = snapshot.val().eventMembers;
      Object.keys(obj).forEach(function (key) {
        if (obj[key].member === currentUserProf) {
          renderEventsListItem(snapshot)
        };
      });
    }
  });

}

function renderEventsListItem(item) {
  var status = '';
  var others = [];
  item.child('eventMembers').forEach(function (snapshot) {
    if (snapshot.val().member === currentUserProf) {
      status = snapshot.val().response;
    } else {
      others.push(snapshot.val())
    }
  })

  var userTagContainers = [];

  // get others...
  others.forEach(function(other){
    database.ref('users/' + other.member).once('value', function(snap) {
      var userTagContainer = $('<div>').addClass('control');
      var userTags = $('<div>').addClass('tags has-addons');
      var nameTag = $('<span>').addClass('tag is-dark is-capitalized').text(snap.val().userName);
      var responseTag = $('<span>').addClass('tag is-capitalized').text(other.response);
      if (other.response === 'pending') {
        responseTag.addClass('is-warning');
      }
    
      if (other.response === 'going') {
        responseTag.addClass('is-success');
      } 
    
      if (other.response === 'not going') {
        responseTag.addClass('is-danger');
      }
      userTags.append(nameTag, responseTag);
      userTagContainer.append(userTags);
      userTagContainers.push(userTagContainer);
    })
  })


  function getDate(a) {
    //03/15/2019
    var dateArray = a.split('/');
    var month = ''
    switch (dateArray[0]) {
      case '01':
        month = 'January'
        break;
      case '02':
        month = 'February'
        break;
      case '03':
        month = 'March'
        break;
      case '04':
        month = 'April'
        break;
      case '05':
        month = 'May'
        break;
      case '06':
        month = 'June'
        break;
      case '07':
        month = 'July'
        break;
      case '08':
        month = 'August'
        break;
      case '09':
        month = 'September'
        break;
      case '10':
        month = 'October'
        break;
      case '11':
        month = 'Novemeber'
        break;
      case '12':
        month = 'December'
        break;
    }
    return [month, dateArray[1]]
  }

  var cardColumn = $('<div>').attr('id', item.key).addClass('column').addClass('is-half');

  var card = $('<div>').addClass('message is-dark').addClass('eventsListItem');

  var date = getDate(item.val().eventDate);

  var cardHeader = $('<header>').addClass('message-header');
  var cardTitle = $('<p>').text(date[0] + ' ' + date[1]);
  cardHeader.append(cardTitle);

  var itemLoc = item.val().eventLocation;

  var cardContent = $('<div>').addClass('message-body');
  var content = $('<div>').addClass('content');
  var eventTitle = $('<h2>').addClass('title is-3').text(item.val().eventName);
  var locationName = $('<h4>').addClass('title is-marginless').text(item.val().eventLocation.name);
  var locationAddress = $('<a>')
    .addClass('locationLink subtitle is-7')
    .attr('data-lat', itemLoc.coordinates.latitude)
    .attr('data-long', itemLoc.coordinates.longitude)
    .attr('data-address', itemLoc.location.display_address[0] +  ', ' + itemLoc.location.display_address[1])
    .text(itemLoc.location.display_address[0] +  ', ' + itemLoc.location.display_address[1]);
  var description = $('<blockquote>').text(item.val().eventDescription).css('marginTop', '20px');
  var friendsGoing = $('<h5>').addClass('title is-6 is-marginless').text("Friends' Status:");
  var friendResponses = $('<div>').css({paddingTop: '10px'}).addClass('buttons').append(userTagContainers);
  content.append(eventTitle, locationName, locationAddress, description, friendsGoing, friendResponses);
  cardContent.append(content);
  
  var responseButtonContainer = $('<div>').addClass('level-item buttons');
  var responseGoing = $('<button>')
    .attr('data-id', item.key)
    .addClass('going')
    .addClass('button')
    .text('Going');
  var responseNotGoing = $('<button>')
    .attr('data-id', item.key)
    .addClass('not-going')
    .addClass('button').text('Not Going');

  if (status === 'pending') {
    var pendingTag = $('<span>').addClass('tag is-medium is-warning is-capitalized').text('Please respond');
    cardHeader.append(pendingTag)
  }

  if (status === 'going') {
    responseGoing.addClass('is-success');
  } 

  if (status === 'not going') {
    responseNotGoing.addClass('is-danger');
  }

  responseButtonContainer.append(responseGoing, responseNotGoing);

  var footer = $('<div>').addClass('level');
  var footerLeft = $('<div>').addClass('level-left');
  var footerRight = $('<div>').addClass('level-right');
  var footerItem = $('<div>').addClass('level-item');
  footerItem.append(responseButtonContainer);
  footerRight.append(footerItem);
  footer.append(footerLeft, footerRight).css({
    padding: "10px",
    borderTop: 'solid 1px rgba(0,0,0,0.1)'
  });

  card.append(cardHeader, cardContent, footer);
  cardColumn.append(card);

  if (!$('#' + item.key).length) {
    $('#user-events').append(cardColumn);
  } else {
    $('#' + item.key).empty().append(card);
  }
}

$(document).on('click', '.going', function(e) {
  e.preventDefault();
  var dataID = $(this).data('id')
  database.ref('events/' + dataID + '/eventMembers').once('value', function(snapshot) {
    var obj = snapshot.val();
    Object.keys(obj).forEach(function (myKey) {
      if (obj[myKey].member === currentUserProf) {
        database.ref('events/' + dataID + '/eventMembers/' + myKey).update({
          response: 'going'
        })
      };
    });
  })
})

$(document).on('click', '.not-going', function(e) {
  e.preventDefault();
  var dataID = $(this).data('id')
  database.ref('events/' + dataID + '/eventMembers').once('value', function(snapshot) {
    var obj = snapshot.val();
    Object.keys(obj).forEach(function (myKey) {
      if (obj[myKey].member === currentUserProf) {
        database.ref('events/' + dataID + '/eventMembers/' + myKey).update({
          response: 'not going'
        })
      };
    });
  })
})

$(document).on('click', '.friend', function () {
  $(this).toggleClass('selected');
  $(this).toggleClass('has-background-primary	has-text-white')
})

$(document).on('click', '#start-event', function (e) {
  e.preventDefault()
  $('#profile').hide();
  $('#create-event').show();
})

$(document).on('click', '#sign-out', function (e) {
  console.log('click')
  e.preventDefault();
  firebase.auth().signOut();
})

$(document).on('click', '.locationLink', function(e) {
  e.preventDefault();
  currentLat = $(this).data('lat');
  currentLong = $(this).data('long');
  currentAddress = $(this).data('address')
  initMap();
  $('#map-modal').addClass('is-active')
})

var dateSelected = '';
var timeSelected = '';

// create an event & add it to a user...
$(document).on('click', '#add-event', function (e) {
  e.preventDefault();

  var eventName = $('#event-name').val().trim();
  var eventDate = dateSelected;
  var eventTime = timeSelected;
  var friends = [];
  var eventLocation = yelpResponse.businesses[selectedYelpResponse];
  var eventDescription = $('#event-description').val().trim();

  $('.friend.selected').each(function () {
    friends.push($(this).data('id'));
  });

  var newEvent = database.ref('/events').push();
  newEvent.set({
    eventOwner: currentUserProf,
    eventName: eventName,
    eventDate: eventDate,
    eventTime: eventTime,
    eventDescription: eventDescription,
    eventLocation: eventLocation
  }).then(function () {
    newEvent.child('eventMembers').push({
      member: currentUserProf,
      response: 'going'
    })
    friends.forEach(function (friend) {
      newEvent.child('eventMembers').push({
        member: friend,
        response: 'pending'
      })
    })

    $('#event-name').val('');
    $('#event-description').val('')
    $('.friend')
      .removeClass('selected')
      .removeClass('has-background-primary')
      .removeClass('has-text-white');

    $('#chosen-place').hide();
    $('#chose-place').find('title').empty();

    $('#event-location').val('');
    $('#eventPlace').show();
  

    $('#create-event').hide();
    $('#profile').show();

  })
})




$(document).on('click', 'button', function (e) {
  e.preventDefault();
})