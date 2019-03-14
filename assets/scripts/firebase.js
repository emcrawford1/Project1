
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
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

var currentUser = null;
var userEmail = null;
var userName = null;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $('#firebaseui-auth-container').hide();
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
    console.log('logged out');
    $('#firebaseui-auth-container').show();
    $('#sign-out').hide()
  }
})


$('#sign-out').click(function(e) {
  e.preventDefault()
  firebase.auth().signOut()
})


var currentUser = 'jstevens'

function getEvent(id) {
  console.log(id);
  database.ref('/events/' + id).on('child_added', function(snapshot) {
    console.log(snapshot.val().eventDate)
  })
}


database.ref('users').on("child_added", function(childSnapshot) {
  var myEvents = childSnapshot.val().userEvents;
  //console.log(childSnapshot.val().userName)

  // myEvents.forEach(function(event) {
  //   getEvent(event)    
  // })


  // console.log(childSnapshot.val().userEvents)
  // database.ref('/users/' + childSnapshot.key).child("userEvents").on("child_added", function(snap) {
  //   console.log(snap.val())
  // })
  
})

// database.ref('/users').on("child_changed", function(childSnapshot) {
//   //console.log(childSnapshot.key)
 
// 

function renderEventsListItem(item) {
  var listItem = $('<li>').addClass('eventsListItem');
  listItem.text(item.eventOwner);
  $('#user-events').append(listItem);
}

database.ref('events').on('child_added', function(childSnapshot) {
  var members = childSnapshot.val().eventMembers;
  if (members !== undefined) {
    if (Object.keys(members).includes(currentUser)) {
      renderEventsListItem(childSnapshot.val())
    }
  }
});

database.ref('events').on('child_changed', function(childSnapshot) {
  var members = childSnapshot.val().eventMembers;
  if (members !== undefined) {
    if (Object.keys(members).includes(currentUser)) {
      renderEventsListItem(childSnapshot.val())
    }
  }
});





// database.ref('/events').orderByChild('eventMembers').on("value", function(snapshot) {
  
//   snapshot.forEach(function(data) {
//    console.log(data.key)
//   })
// })
// // 

// create an event & add it to a user...
$('#add-event').click(function(e) {
  e.preventDefault();

  var eventName = $('#event-name').val().trim();
  var eventDate = $('#event-date').val().trim();

  //
  var newEvent = database.ref('/events').push();
  newEvent.set({
    eventOwner: currentUser,
    eventName: eventName,
    eventDate: eventDate,
    location: { id: '.asdnlakndga' },
    //eventMembers: [currentUser]    
  }).then(function() {
    newEvent.child('eventMembers/' + currentUser).set({id: 'yeah'});
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



// database.ref('/events').push({
//   eventName: 'New Event...'
// })

// database.ref('users/' + 'jstevens').set({
//   firstName: 'Josh',
//   lastName: 'Stevens',
//   userName: 'jstevens'
// })

