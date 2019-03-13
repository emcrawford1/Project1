
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


// var uiConfig = {
//   signInSuccessUrl: '<url-to-redirect-to-on-success>',
//   signInOptions: [
//     // Leave the lines as is for the providers you want to offer your users.
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//     firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//     firebase.auth.GithubAuthProvider.PROVIDER_ID,
//     firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     firebase.auth.PhoneAuthProvider.PROVIDER_ID,
//     firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
//   ],
//   // tosUrl and privacyPolicyUrl accept either url string or a callback
//   // function.
//   // Terms of service url/callback.
//   tosUrl: '<your-tos-url>',
//   // Privacy policy url/callback.
//   privacyPolicyUrl: function() {
//     window.location.assign('<your-privacy-policy-url>');
//   }
// };

// // Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// // The start method will wait until the DOM is loaded.
// ui.start('#firebaseui-auth-container', uiConfig);




// user authenetication...

var currentUser = '-L_oPiwhwbFU95fGA2hC'


database.ref('/users').on("child_added", function(childSnapshot) {
  var myEvents = childSnapshot.val().userEvents;


  // console.log(childSnapshot.val().userEvents)
  // database.ref('/users/' + childSnapshot.key).child("userEvents").on("child_added", function(snap) {
  //   console.log(snap.val())
  // })
  
})

// database.ref('/users').on("child_changed", function(childSnapshot) {
//   //console.log(childSnapshot.key)
  
// })

database.ref('/events').on("child_added", function(childSnapshot) {
  //console.log(childSnapshot.key)
  
})


// 

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
    eventMembers: [currentUser]    
  }).then(function() {
    var events = []
    database.ref('/users/' + currentUser).once('value').then(function(snapshot) {
      if (snapshot.val().userEvents !== undefined) {
        events = snapshot.val().userEvents
      }

      events.push(newEvent.key);

      database.ref('/users/' + currentUser).update({userEvents: events});

    })
  })
  
})



// database.ref('/events').push({
//   eventName: 'New Event...'
// })

// database.ref('/users').push({
//   firstName: 'Josh',
//   lastName: 'Stevens'
// })

