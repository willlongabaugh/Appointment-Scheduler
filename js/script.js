$(document).ready(function() {

  $('#submit-form').validate({
    rules: {
      name: {
        minlength: 2,
        required: true
      },
      email: {
        required: true,
        email: true
      },
      subject: {
        minlength: 2,
        required: true
      },
      message: {
        minlength: 2,
        required: true
      }
    },
    highlight: function(element) {
      $(element).closest('.control-group').removeClass('success').addClass('danger');
    },
    success: function(element) {
      element
      .text('OK!').addClass('valid')
      .closest('.control-group').removeClass('danger').addClass('success');
    }

  });

  // PROFESSOR SELECTION///////////////////////////////
  var professor;
  professor = $("#dropdown option:selected").val();

  //clear calendar values, only clears on page open, not on switch
  if(professor == "default"){
    $(".half-hour").empty();
    $(".half-hour").removeClass("success");
    $(".half-hour").removeClass("danger");
  }

  //$(document).on('change','#dropdown',function(e){
  $("select").change(function() {
    if($('#dropdown option:selected').val() != "default"){
      //clear table first
      $(".half-hour").empty();
      $(".half-hour").removeClass("success");
      $(".half-hour").removeClass("danger");
      //RETRIEVE FIREBASE DATA HERE
      professor = $("#dropdown option:selected").val();       
      fillDay(professor,"monday");
      fillDay(professor,"tuesday");
      fillDay(professor,"wednesday");
      fillDay(professor,"thursday");
      fillDay(professor,"friday");

    }
  });
  //END PROFESSOR SELECTION//////////////////////////////////////////////////////

  function fillDay(professor, day) {
    var dayRef = new Firebase('https://cs390-appt-scheduler.firebaseio.com/professors/'+professor+'/'+day);
    
    var timeSlotClass;
    
    console.log('outside');
    dayRef.on("child_added", function(snapshot) {
      console.log('inside');  
      if(snapshot.hasChildren()) {
        snapshot.forEach(function(childsnapshot) {
          timeSlotClass = day + '\\/' + snapshot.name();
          console.log(timeSlotClass);
          console.log(childsnapshot.val());
          console.log(childsnapshot.child('name').val());
          console.log(childsnapshot.hasChild('available'));
          console.log(childsnapshot.child('available').val());
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



  //Modal form code///////////////////////////////////////////
  var currentTime;
  var name;
  var email;
  var reason;
  var id;
  var timeRef;

  $('.half-hour').click(function() {
    currentTime = $(this);
    id = currentTime.attr('id');
    timeRef = new Firebase('https://cs390-appt-scheduler.firebaseio.com/professors/'+professor+'/'+id);

    //clicking an available slot///////////////
    if(currentTime.hasClass('success')) {
      $("#submit-form-container").modal('show');
    }
    
    //cancelling an appointment////////////////
    // need authentication so that you can't cancel someone else's appointment
    else if(currentTime.hasClass('danger')) {
      $(currentTime).removeClass('danger');
      $(currentTime).addClass('success');
      $(currentTime).text('Available');
      //SEND EMAIL TO PROFESSOR?

      //UPDATE FIREBASE DATA
      timeRef.child('name').set('--');
      timeRef.child('email').set('--');
      timeRef.child('reason').set('--');
      timeRef.child('available').set('Available');
      
    }



    

    //Form buttons/////////////////////
    $('#submit-button').click(function() {
      
      //Submitting an appointment request/////////
      if(currentTime.hasClass('success')) {
        
        name   = $('#name').val();
        email  = $('#email').val();
        reason = $('#reason').val();
        id     = currentTime.attr('id');
        //console.log('id is ' + id);

        $(currentTime).addClass('danger');
        $(currentTime).removeClass('success');
        $(currentTime).text(name);
        $('#submit-form-container').modal('hide');
        $('form')[0].reset();
        //SEND EMAIL TO PROFESSOR

        //UPDATE FIREBASE DATA
        timeRef.child('name').set(name);
        timeRef.child('email').set(email);
        timeRef.child('reason').set(reason);
        timeRef.child('available').set('Taken');
      }  
    });

    //Hitting cancel button in the form////////
    $('#cancel-button').click(function() {
      $('#submit-form-container').modal('hide');
    });
  });

  //End modal code////////////////////////////////////////////////

});