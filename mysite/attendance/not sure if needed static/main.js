$(document).ready(function(){
	
	$('#register-cohort').on('submit', function(event){
    event.preventDefault();
    console.log("form submitted!")  // sanity check
    create_post();
	});

	$.ajax({
	        url: '/ajax/validate_username/',
	        data: {
	          'username': username
	        },
	        dataType: 'json',
	        success: function (data) {
	          if (data.is_taken) {
	            alert("A user with this username already exists.");
	          }
	        }
	      });

})