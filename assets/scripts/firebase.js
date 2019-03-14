
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
  $('#sign-out').click(function(e) {
    e.preventDefault()
    firebase.auth().signOut()
  })
  
  database.ref('users').on('child_added', function(snapshot) {
    if (snapshot.key !== currentUserProf) {
      var friend = $('<li>').addClass('friend');
      friend.attr('data-id', snapshot.key);
      friend.text(snapshot.val().userName);
      $('#friends-container').append(friend);
    }
  })
  
  $(document).on('click', '.friend', function() {
    $(this).toggleClass('selected');
  })
  
  
  function renderEventsListItem(item) {
    var eventItem = $('<li>').addClass('eventsListItem');
    eventItem.attr('id', item.key)
    var eventTitle = $('<h3>').text(item.val().eventName);
    //var eventResponse = $('Going: ' + item.val())
    eventItem.append(eventTitle);
    if (!$('#' + item.key).length) {
      $('#user-events').append(eventItem);
    }
  }
  
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
  
  // for some reason this is duplicating calls on the most recent
  
  database.ref('events').on('child_added', function(snapshot) {
    snapshot.child('eventMembers').forEach(function(childSnaphot) {
      if (childSnaphot.val().member === currentUserProf) {
        renderEventsListItem(snapshot)
      }
    }) 
  });
  
  // create an event & add it to a user...
  $('#add-event').click(function(e) {
    e.preventDefault();
  
    var eventName = $('#event-name').val().trim();
    var eventDate = $('#event-date').val().trim();
    var friends = []
    
    $('.selected').each(function() {
      friends.push($(this).data('id'));
    });
  
    var newEvent = database.ref('/events').push();
    newEvent.set({
      eventOwner: currentUserProf,
      eventName: eventName,
      eventDate: eventDate,
      location: { id: '.asdnlakndga', address: '123 main street, nashville, tn' },
    }).then(function() {
      newEvent.child('eventMembers').push({ member: currentUserProf, response: 'going' })
      friends.forEach(function(friend) {
        newEvent.child('eventMembers').push({ member: friend, response: 'none'})
      })
  
      $('#create-event').hide();
      $('#profile').show();
  
    })
  })
  
  $('#start-event').click(function() {
    $('#profile').hide();
    $('#create-event').show();
  })
  




}

