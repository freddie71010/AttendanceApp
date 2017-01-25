$(document).ready(function(){
console.log("js loaded")
// js for the Index.html page
	$('.new-cohort-button').on('click', function(event){
		var item = document.getElementById('cohort-register-div')
		var cohort =document.getElementsByClassName('new-cohort-button')		
		if (item.className=='hidden'){
			item.className='unhidden';
			cohort.innerHTML='Hide Form';
			cohort.id='hidden';
		} else {
			item.className ='hidden';
			cohort.innerHTML= 'Add Cohort';
			cohort.id ='id', 'new-cohort-button';
		}

		})
//ajax for the index.html dynamically submit the form
	$('#register-cohort').on('click', function(event){
		event.preventDefault();
		console.log("register form submitted")
		 kwargs={
            	"cohort_name": $('input[name="cohort_name"]').val(),
            	"teacher": $('#id_teacher option:selected').text(),
            	"start_date": $('input[name="start_date"]').val(),
            	"graduation_date": $('input[name="graduation_date"]').val(),
            	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val(),
            },
           console.log(typeof(kwargs["graduation_date"]))
        $.ajax({
            url: "/register_cohort",
            type: "post",
            data: kwargs,
 
            
            success: function(data){
            	// console.log("success", json );
            	$('#myform').html(data)

            },
            error: function(){
            	console.log("error");
            	console.log($('input[name="cohort_name"]').val());
            }
            
        })
   
    });

 // // this code makes sure the django ajax works and we dont have to deal with a bunch of csrf bs
 //    // This function gets cookie with a given name
 //    function getCookie(name) {
 //        var cookieValue = null;
 //        if (document.cookie && document.cookie != '') {
 //            var cookies = document.cookie.split(';');
 //            for (var i = 0; i < cookies.length; i++) {
 //                var cookie = jQuery.trim(cookies[i]);
 //                // Does this cookie string begin with the name we want?
 //                if (cookie.substring(0, name.length + 1) == (name + '=')) {
 //                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
 //                    break;
 //                }
 //            }
 //        }
 //        return cookieValue;
 //    }
 //    var csrftoken = getCookie('csrftoken');

 //    /*
 //    The functions below will create a header with csrftoken
 //    */

 //    function csrfSafeMethod(method) {
 //        // these HTTP methods do not require CSRF protection
 //        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
 //    }
 //    function sameOrigin(url) {
 //        // test that a given url is a same-origin URL
 //        // url could be relative or scheme relative or absolute
 //        var host = document.location.host; // host + port
 //        var protocol = document.location.protocol;
 //        var sr_origin = '//' + host;
 //        var origin = protocol + sr_origin;
 //        // Allow absolute or scheme relative URLs to same origin
 //        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
 //            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
 //            // or any other URL that isn't scheme relative or absolute i.e relative.
 //            !(/^(\/\/|http:|https:).*/.test(url));
 //    }

 //    $.ajaxSetup({
 //        beforeSend: function(xhr, settings) {
 //            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
 //                // Send the token to same-origin, relative URLs only.
 //                // Send the token only if the method warrants CSRF protection
 //                // Using the CSRFToken value acquired earlier
 //                xhr.setRequestHeader("X-CSRFToken", csrftoken);
 //            }
 //        }
    });
