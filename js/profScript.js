$(document).ready(function() {
  var professor;

      professor = "sfkaplan";       //TODO; get this info
      fillDay(professor,"monday");
      fillDay(professor,"tuesday");
      fillDay(professor,"wednesday");
      fillDay(professor,"thursday");
      fillDay(professor,"friday");
    

  

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
        timeSlotClass = document.getElementByID//'#'+day+'\/0'+i;
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
    // alert(state +" " +timeSlotClass);
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



});