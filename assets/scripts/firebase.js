var currentUser = null;
var userEmail = null;
var userName = null;
var currentUserProf = null;

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
  signInSuccessUrl: '/datacalls.html',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    userName = user.displayName;
    userEmail = user.email;
    currentUser = user.uid;
    
    $('#login').hide();
    $('#profile > h1').text('Hello, ' + userName + '!');
    $('#profile').show();
    
    var userExists = false
    database.ref('users').once('value', function(snapshot) {
      snapshot.forEach(function(childSnaphot) {
        if (childSnaphot.val().userID === currentUser) {
          currentUserProf = childSnaphot.key;
          userExists = true;
        }
      })
    }).then(function() {
      if (!userExists) {
        database.ref('users').push({
          userID: currentUser,
          userName: userName,
          userEmail: userEmail
        })
      }
    }).then(function() {
      init();
    })
  } else {
    $('#login').show();
    $('#profile').hide();
    $('#sign-out').hide();
  }
})

function init() {
  
  database.ref('users').on('child_added', function(snapshot) {
    if (snapshot.key !== currentUserProf) {
      var friendColumn = $('<div>').addClass('column');
      var friend = $('<div>').addClass('card').addClass('friend');
      friend.attr('data-id', snapshot.key);
      var friendContent = $('<div>').addClass('card-content');
      var friendName = $('<p>').addClass('has-text-weight-bold').text(snapshot.val().userName);
      friendContent.append(friendName);
      friend.append(friendContent);
      friendColumn.append(friend)
      $('#friends-container').append(friendColumn);
    }
  })
    
  database.ref('events').on('child_removed', function(oldChildSnapshot) {
    $('#' + oldChildSnapshot.key).remove();
  });
  
  database.ref('events').on('child_changed', function(snapshot) {
    snapshot.child('eventMembers').forEach(function(childSnaphot) {
      if (childSnaphot.val().member === currentUserProf) {
        renderEventsListItem(snapshot)
      }
    }) 
  });
    
  database.ref('events').on('child_added', function(snapshot) {
    snapshot.child('eventMembers').forEach(function(childSnaphot) {
      if (childSnaphot.val().member === currentUserProf) {
        renderEventsListItem(snapshot)
      }
    }) 
  });
}

function renderEventsListItem(item) {
  var status = '';
  item.child('eventMembers').forEach(function(snapshot) {
    if (snapshot.val().member === currentUserProf) {
      status = snapshot.val().response;
    }
  })

  console.log(item.val())

  function getDate(a) {
    var dateArray = a.split('-');
    var month = ''
    switch(dateArray[1]) {
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
    return [month, dateArray[2]]
  }

  

  var cardColumn = $('<div>').addClass('column').addClass('is-half');

  var card = $('<div>').addClass('card').addClass('eventsListItem');
  card.attr('id', item.key);

  var date = getDate(item.val().eventDate);
  
  var cardHeader = $('<header>').addClass('card-header');
  var cardTitle = $('<p>').addClass('card-header-title').text(date[0] + ' ' + date[1]);
  cardHeader.append(cardTitle);

  var cardContent = $('<div>').addClass('card-content');
  var content = $('<div>').addClass('content');
  var eventTitle = $('<h2>').text(item.val().eventName);
  var locationName = $('<h4>').text(item.val().eventLocation.name);
  content.append(eventTitle, locationName);
  cardContent.append(content);

  var cardFooter = $('<footer>').addClass('card-footer');
  cardFooter.text(status);

  card.append(cardHeader, cardContent, cardFooter);
  cardColumn.append(card);

  if (!$('#' + item.key).length) {
    $('#user-events').append(cardColumn);
  }
}


$(document).on('click', '.friend', function() {
  $(this).toggleClass('selected');
})

$(document).on('click', '#start-event', function(e) {
  e.preventDefault()
  $('#profile').hide();
  $('#create-event').show();
})

$(document).on('click', '#sign-out', function(e) {
  e.preventDefault();
  firebase.auth().signOut();
})

var dateSelected = '';
var timeSelected = '';

// create an event & add it to a user...
$(document).on('click', '#add-event', function(e) {
  e.preventDefault();

  var eventName = $('#event-name').val().trim();
  var eventDate = dateSelected;
  var eventTime = timeSelected;
  var friends = [];
  var eventID = $('#yelp-results').find('.selected').attr('id');

  //var eventLocation = yelpResponse.businesses[eventID];
  
  $('friend.selected').each(function() {
    friends.push($(this).data('id'));
  });

  console.log(eventName, eventDate, eventTime, friends, eventID)

  // var newEvent = database.ref('/events').push();
  // newEvent.set({
  //   eventOwner: currentUserProf,
  //   eventName: eventName,
  //   eventDate: eventDate,
  //   eventLocation: eventLocation
  // }).then(function() {
  //   newEvent.child('eventMembers').push({ member: currentUserProf, response: 'going' })
  //   friends.forEach(function(friend) {
  //     newEvent.child('eventMembers').push({ member: friend, response: 'none'})
  //   })

  //   $('#create-event').hide();
  //   $('#profile').show();

  // })
})






$(document).ready(function() {
    var calOptions = {
      type: 'date',
      showFooter: false,
      showHeader: false
    }
    
    var timeOptions = {
      type: 'time',
      showFooter: true
    }
    bulmaCalendar.attach('#event-date', calOptions);
    bulmaCalendar.attach('#event-time', timeOptions);


    var dateElement = document.querySelector('#event-date');
    if (dateElement) {
      dateElement.bulmaCalendar.on('select', function(datepicker) {
        dateSelected = datepicker.data.value();
      })
    }

    var timeElement = document.querySelector('#event-time');
    if (timeElement) {
      timeElement.bulmaCalendar.on('select', function(timepicker) {
        timeSelected = timepicker.data.value();
      })
    }


})


// var element = $('#event-date');
// if (element) {
//   element.bulmaCalendar.on('date:selected', function(datepicker) {
//     console.log(datepicker.date.value())
//   })
// }

// $(time).on('select', function(time) {
// 	console.log(time);
// });

// $('#event-date').on('focus', function() {
//   console.log('click');
// })

$('.datetimepicker-clear-button').click(function(e){
  e.preventDefault()
})