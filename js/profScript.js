$(document).ready(function() {
  var professor;

      professor = "ccmcgeoch";       //TODO; get this info
      fillDay(professor,"monday");
      fillDay(professor,"tuesday");
      fillDay(professor,"wednesday");
      fillDay(professor,"thursday");
      fillDay(professor,"friday");




  //retrive data from Firebase for a specific day
  function fillDay(professor, day) {
    var dayRef = new Firebase('https://cs390-appt-scheduler.firebaseio.com/professors/'+professor+'/'+day);
    
    var timeSlotClass;
    
    console.log('outside');
    dayRef.on("child_added", function(snapshot) {
      console.log('inside');  
      if(snapshot.hasChildren()) {
        snapshot.forEach(function(childsnapshot) {
          timeSlotClass = day + '\\/' + snapshot.name();
          /*
          console.log(timeSlotClass);
          console.log(childsnapshot.val());
          console.log(childsnapshot.child('name').val());
          console.log(childsnapshot.hasChild('available'));
          console.log(childsnapshot.child('available').val());
          */

          if(childsnapshot.val() == 'Available') {
            console.log('available yes');
            $('#'+timeSlotClass).addClass('success');
            $('#'+timeSlotClass).text('Available');
          }
          else if(childsnapshot.val() == 'Taken') {
            console.log('available no');
            $('#'+timeSlotClass).addClass('danger');
            $('#'+timeSlotClass).text(snapshot.child('name').val());
          }
        });
      }
    });
  }


  

  var currentTimeP;

  var profRef;
  var timeRef;
  var time;
  var day;

  // for Professors clicking on a time slot
  $('.half-hour-prof').click(function() {
    currentTimeP = $(this);
    id = currentTimeP.attr('id'); //todo V

    
    profRef = new Firebase('https://cs390-appt-scheduler.firebaseio.com/professors/'+professor);
    timeRef = new Firebase('https://cs390-appt-scheduler.firebaseio.com/professors/'+professor+'/'+id);
    time = id.substr(id.length-4, id.length);
    day  = id.substr(0, id.length-4);

    //making an appointment from an empty slot////////////////
    if(!currentTimeP.hasClass('danger') && !currentTimeP.hasClass('success')) {
      currentTimeP.addClass('success');
      currentTimeP.text('Available');
      profRef.child(day).child(time).set({available : 'Available', name : '--', email : '--', reason : '--'});
      
    }
    //cancelling a slot, regardless if taken or available
    else {
      //clears html table cell
      currentTimeP.empty();
      currentTimeP.removeClass('success');
      currentTimeP.removeClass('danger');

      //sets a value for the time slot, which wipes out any child data
      profRef.child(day).child(time).set('--');
      
    }

    /*
    if(currentTimeP.hasClass('danger')) {
      $(currentTimeP).removeClass('danger');
      $(currentTimeP).addClass('success');
      $(currentTimeP).text('Available');
      //SEND EMAIL TO PROFESSOR?
  
      //UPDATE FIREBASE DATA

      timeRef.child('available').set('Available');    
      
      /*
    }
    else{
      $(currentTimeP).addClass('success');
      $(currentTimeP).text('Available');

      timeRef.child('available').set('Available');     

    }

    //cancelling an availability slot, hence making it unavailable///////////////
    if(currentTimeP.hasClass('success')) {
     $(currentTimeP).removeClass('success');
     $(currentTimeP).empty();
      //SEND EMAIL TO PROFESSOR?

      //UPDATE FIREBASE DATA

      timeRef.child('available').set('Unavailable');  
    }
    */

  });



});