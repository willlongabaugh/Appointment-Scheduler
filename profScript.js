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

    professor = 'lamcgeoch';       //TODO
      fillDay(professor,"monday");
      fillDay(professor,"tuesday");
      fillDay(professor,"wednesday");
      fillDay(professor,"thursday");
      fillDay(professor,"friday");
    
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

  //retrive data from Firebase for a specific day
  function fillDay(professor, day) {
    var dayRef = new Firebase('https://cs390-appt-scheduler.firebaseio.com/professors/'+professor+'/'+day);
    var dataRef;
    var nameRef;
    var timeSlotClass;
    var iRef;
    var state;

    //fill in hourly slots
    var i = 700;
    while(i <= 1730) {
    //for (var i = 700; i <= 1700; ) {
      if(i < 1000) {
        timeSlotClass = '#'+day+'\/0'+i;
        iRef = '0'+ i;
      } else {
        timeSlotClass = '#'+day+'\/'+i;
        iRef = i;
      }
      //dataRef = new Firebase('https://cs390-appt-scheduler.firebaseio.com/professors/'+professor+'/'+day+'/'+iRef+'/available');
      dataRef = dayRef.child(iRef+'/available');
    //alert(dataRef+" dataRef outside");
      dataRef.on('value', function(snapshot) {
   
        state = snapshot.val();
     alert(state +" " +timeSlotClass);
        if(state == 'Available') {
          $(timeSlotClass).addClass('success');
          $(timeSlotClass).text(state);
        } else if(state == 'Taken') {
          nameRef = dayRef.child(iRef+'/name');
          nameRef.on('value', function(param) {
            $(timeSlotClass).addClass('danger');
            $(timeSlotClass).text(param.val());
          });
          
        }
      });

      //increment the time
      if(i%100 == 30) { 
        i += 70;
      } else if(i%100 == 0) {
        i+= 30;
      }

    };

    

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
        //alert('id is ' + id);

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


var currentTimeP;
 
 var timeRef2;

   $('.half-hour-prof').click(function() {
    currentTimeP = $(this);
    id = currentTimeP.attr('id'); //todo V
    timeRef2 = new Firebase('https://cs390-appt-scheduler.firebaseio.com/professors/'+professor+'/'+id);
    
    //cancelling an availability slot, hence making it unavailable///////////////
    if(currentTimeP.hasClass('success')) {
       $(currentTimeP).removeClass('success');
      $(currentTimeP).empty();
      //SEND EMAIL TO PROFESSOR?

      //UPDATE FIREBASE DATA
     
      timeRef2.child('available').set('Unavailable');     
      //$("#submit-form-container").modal('show');
    }
    
    //making an appointment////////////////
    else if(currentTimeP.hasClass('danger')) {
      $(currentTimeP).removeClass('danger');
      $(currentTimeP).addClass('success');
      $(currentTimeP).text('Available');
      //SEND EMAIL TO PROFESSOR?

      //UPDATE FIREBASE DATA
     
      timeRef2.child('available').set('Available');    
      
    }
    else{
      $(currentTimeP).addClass('success');
      $(currentTimeP).text('Available');

      timeRef2.child('available').set('Available');     

    }
  
  });


//OLD STUFF///////////////////////////////////////////////////////
/*
  $(function() {
    var name = $( "#name" ),
    email = $( "#email" ),
    password = $( "#password" ),
    allFields = $( [] ).add( name ).add( email ).add( password ),
    tips = $( ".validateTips" );

    function updateTips( t ) {
      tips
      .text( t )
      .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 500 );
    }
    
    
    
    
    $(function() {
      var name = $( "#name" ),
      email = $( "#email" ),
      reason = $( "#reason" ),
      allFields = $( [] ).add( name ).add( email ).add( reason ),
      tips = $( ".validateTips" );

      function updateTips( t ) {
        tips
        .text( t )
        .addClass( "ui-state-highlight" );
        setTimeout(function() {
          tips.removeClass( "ui-state-highlight", 1500 );
        }, 500 );
      }

      function checkLength( o, n, min, max ) {
        if ( o.val().length > max || o.val().length < min ) {
          o.addClass( "ui-state-error" );
          updateTips( "Length of " + n + " must be between " +
            min + " and " + max + "." );
          return false;
        } else {
          return true;
        }
      }

      function checkRegexp( o, regexp, n ) {
        if ( !( regexp.test( o.val() ) ) ) {
          o.addClass( "ui-state-error" );
          updateTips( n );
          return false;
        } else {
          return true;
        }
      }

      $( "#dialog-form" ).dialog({
        autoOpen: false,
        dialogClass: "no-close",
        height: 420,
        width: 400,
        modal: true,
        buttons: {
          "Create an appointment": function() {
            var bValid = true;
            allFields.removeClass( "ui-state-error" );

            bValid = bValid && checkLength( name, "username", 3, 26 );
            bValid = bValid && checkLength( email, "email", 6, 80 );
            bValid = bValid && checkLength( reason, "reason", 3, 300 );

            bValid = bValid && checkRegexp( name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );
          // From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
          bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
       //   bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );

       if ( bValid ) {

        $(divLexie).append( "<tr>" +
          "<td>" + name.val() + "</td>" +
          "<td>" + email.val() + "</td>" +
          "<td>" + reason.val() + "</td>" +
          "</tr>" );
        $( this ).dialog( "close" );
      }
    },
    Cancel: function() {
      $(divLexie).attr("class", "half-hour available");
      $(divLexie).text("Available");
      $( this ).dialog( "close" );
    }
  },
  close: function() {
    allFields.val( "" ).removeClass( "ui-state-error" );
  }
});

});
});



*/
});