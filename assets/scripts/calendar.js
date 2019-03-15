

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


		
