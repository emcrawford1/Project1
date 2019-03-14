
var currentUser = null;
var userEmail = null;
var userName = null;



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
    $('#login').hide();
    $('#profile').show();
    userName = user.displayName;
    userEmail = user.email;
    currentUser = user.uid;
    user.getIdToken().then(function(accessToken) {
      var userExists = false
      database.ref('users').once('value', function(snapshot) {
        snapshot.forEach(function(childSnaphot) {
          if (childSnaphot.val().userID === currentUser) {
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
      })
    })
  } else {
    $('#login').show();
    $('#profile').hide();
    $('#sign-out').hide();
  }
})


$('#sign-out').click(function(e) {
  e.preventDefault()
  firebase.auth().signOut()
})


// function getEvent(id) {
//   console.log(id);
//   database.ref('/events/' + id).on('child_added', function(snapshot) {
//     console.log(snapshot.val().eventDate)
//   })
// }

function renderEventsListItem(item) {
  console.log(item)
  var listItem = $('<li>').addClass('eventsListItem');
  listItem.text(item.eventName);
  $('#user-events').append(listItem);
}

var myEvents = [];

database.ref('events').on('child_added', function(snapshot) {
  snapshot.forEach(function(childSnaphot) {
    if (childSnaphot.val().member === currentUser) {
     renderEventsListItem(snapshot.val())
    }
  })
});

// create an event & add it to a user...
$('#add-event').click(function(e) {
  e.preventDefault();

  var eventName = $('#event-name').val().trim();
  var eventDate = $('#event-date').val().trim();

  var newEvent = database.ref('/events').push();
  newEvent.set({
    eventOwner: currentUser,
    eventName: eventName,
    eventDate: eventDate,
    location: { id: '.asdnlakndga' },
  }).then(function() {
    //newEvent.child('eventMembers/' + currentUser).set({id: 'yeah'});
    newEvent.child('eventMembers').set({ member: currentUser, response: 'pending' })
    // var events = [];
    // database.ref('/users/' + currentUser).once('value').then(function(snapshot) {
    //   if (snapshot.val().userEvents !== undefined) {
    //     events = snapshot.val().userEvents
    //   }
    //   events.push(newEvent.key);
    //   database.ref('/users/' + currentUser).update({userEvents: events});
    // })
  })
  
})

$('#start-event').click(function() {
  $('#profile').hide();
  $('#create-event').show();
})
