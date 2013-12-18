$(document).ready(function() {
$('#username').focus();

    $('#submit').click(function() {
		var profsArray=new Array("jerager","lamcgeoch","ccmcgeoch","sfkaplan");
        event.preventDefault(); // prevent PageReLoad
        $('.error').css('display', 'none'); // hide error msg
		
        var Username = $('#username').val(); // Email Value
		
		
        //var ValPassword = $('#password').val('admin'); // Password Value
		//document.write(var professor=Username);
        if (profsArray.indexOf(Username)!=-1) { // if Username is in the array of professors
            //alert('valid!'); // alert valid!
			window.location = "profsPage.html?"+Username; // go to profsPage.html
        }
        else {
            alert('not valid!'); // alert not valid!
            $('.error').css('display', 'block'); // show error msg
        }
    });


});