$(document).ready(function(){
	console.log("main.js loaded!")



// ON LOAD ===========================================================================================

//Sets calendar values on Cohort Detail page
	var now = moment();
	var start_of_week = now.startOf('week');
	$('#todays-date').html("Week of " + start_of_week.format("MMMM D, YYYY"));
	date_loop(start_of_week);

//defaults settings as if the current day was selected - background color to yellow, button value set as today's date
	onload_sets_todays_date();


	$(".datepicker").datepicker();

//FUNCTIONS =============================================================================
	function date_loop(start_of_week) {
		for (i = 1; i <= 7; i++) {
			if (i == 1) {
				$('.cal-numdays li:nth-child('+i+')').html(start_of_week.date())
				start_of_week.add(1, 'days')
			}
			else {
				$('.cal-numdays li:nth-child('+i+')').html(start_of_week.date())
				start_of_week.add(1, 'days')
			}
		};
		start_of_week.subtract(7, 'days')
	} //end func

	function onload_sets_todays_date() {
		todays_date = moment();
		for (i = 0; i < $('ul.cal-numdays li').length; ++i) {
			if (parseInt(todays_date.format('D')) == parseInt($('.cal-numdays li:nth-child('+i+')').text())){
				$('.cal-numdays li:nth-child('+i+')').css("background-color","yellow");
				$('.take-attendance-button').html("<span class='glyphicon glyphicon-plus'></span> Submit Attendance - " + todays_date.format('ddd, MMM D'));
				$('.take-attendance-button').attr('value', todays_date.format('YYYY-MM-DD'));
			}
		}
	} //end func

	//removes the dismissible button elements from a prev click
	function remove_popover() {
		$('ul.cal-numdays li a').detach();
		$('ul.cal-numdays li div').detach();
	}; //end func


// ===========================================================================================

	//when next button is clicked, the following week's dates are displayed
	$('.next').on('click', function(event){
		start_of_week = start_of_week.add(7, 'days')
		
		$('#todays-date').html("Week of " + start_of_week.format("MMMM D, YYYY"));
		date_loop(start_of_week);
		$('ul.cal-numdays li').removeAttr("style");		
		$('.take-attendance-button').attr('disabled', 'disabled');
		$('.take-attendance-button').html("<span class='glyphicon glyphicon-plus'></span> Submit Attendance");
		
		console.log("start_of_week:\t", start_of_week.format('MMM D'));
	});

	//when prev button is clicked, the previous week's dates are displayed
	$('.prev').on('click', function(event){
		start_of_week = start_of_week.subtract(7, 'days')
		
		$('#todays-date').html("Week of " + start_of_week.format("MMMM D, YYYY"));
		date_loop(start_of_week);		
		$('ul.cal-numdays li').removeAttr("style");

		$('.take-attendance-button').attr('disabled', 'disabled');
		$('.take-attendance-button').html("<span class='glyphicon glyphicon-plus'></span> Submit Attendance");

		console.log("start_of_week:\t", start_of_week.format('MMM D'));
	});

	// when a specific date number is clicked on, the background changes and that date is selected for DB query use
	$('ul.cal-numdays li').on('click', function(event){
		event.preventDefault();

		//activates popover (boostrap JS) functionality
		$(function () {
			$('[data-toggle="popover"]').popover()
		})

		//modifies various elements on page - specific date background color, attendance button text changes
		//---------------------------------------------------------------------------------------------------
		diff = $(this).index();
		$('ul.cal-numdays li').removeAttr("style id");
		$(".btn-group").children().removeClass("active");
		
		remove_popover();
		
		$(this).css("background-color","yellow");
		$(this).attr('id', 'clicked_date');
		start_of_week.add(diff,'d');
		$('.take-attendance-button').removeAttr('disabled');
		$('.take-attendance-button').attr('value', start_of_week.format('YYYY-MM-DD'));
		$('.take-attendance-button').html("<span class='glyphicon glyphicon-plus'></span> Submit Attendance - " + start_of_week.format('ddd, MMM D'));
		start_of_week.subtract(diff,'d');

		//resets all radio inputs to empty
		$(".student-radio-tags input:radio").prop('checked', false)

		//creates object with student information to be used in ajax call
		var student_names_obj = {};
		$(".username").each(function() {
		    id = $(this).attr('id');
		    student_names_obj[id] = 'NA';
		});
		var date_value = $('.take-attendance-button').attr('value');
		var kwargs = {
					"student_names_obj": student_names_obj,
					"date_value": $('.take-attendance-button').attr('value'),
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
		};
		console.log("pre-ajax kwargs:", kwargs)

		
		//ajax call to grab user date data from DB
		$.ajax({
			url: "/get_attendance",
			type: "GET",
			data: kwargs,
			success: function(response){
				console.log("AJAX call to grab user date data from DB=============");
				console.log("Response:",response);
				data = response.spec_date_records;
				console.log("spec_date_records data:", (data))
				// if DB has NO date date, the string "NO_DATE_DATA_FOUND" is returned here
				if (data === "NO_DATE_DATA_FOUND"){
					$('<a id="clicked_date_popover" data-placement="bottom" tabindex="0" role="button" data-toggle="popover" data-trigger="focus"  data-content="No Attendance Records Found!"></a>').appendTo('#clicked_date');
					$('#clicked_date_popover').popover('show');
				} else { 
				//load the data from DB into the radio input buttons
					$.each(data, function(k,v) {
						if (v === "present") {
							i = 0;
						} else if (v === "unexcused") {
							i = 1;
						} else if (v === "excused") {
							i = 2;
						} else { //"late"
							i = 3;
						};
						k = k.replace(".", "\\.");
						$("form#" + k + " .btn-group").children().eq(i).addClass('active');
					})
					console.log("AJAX finished*****")
				}; //end else
			},
			error: function(){
				console.log("****Date Records Load Error****");
			}
		}) //end ajax


	}); //end func

// ===========================================================================================

//hides and unhides "New Cohort" form
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
	});

//ajax for "New Cohort" form
	$('#register-cohort').on('click', function(event){
		event.preventDefault();
		console.log("register form submitted!")
		kwargs={
				"cohort_name": $('input[name="cohort_name"]').val(),
				"teacher": $('#id_teacher option:selected').text(),
				"start_date": +new Date($('input[name="start_date"]').val()),
				"graduation_date": +new Date($('input[name="graduation_date"]').val()),
				"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val(),
			}
		//Checks to see if all form fields are filled out
		if (isNaN(kwargs.graduation_date) || isNaN(kwargs.start_date) || kwargs.teacher === "Select a teacher" || kwargs.cohort_name == null | kwargs.cohort_name == "") {
			alert("Please fill out all fields.");
			return false;
		}
		
		console.log("No Error - continuing to ajax!")
		$.ajax({
			url: "/register_cohort",
			type: "POST",
			data: kwargs,
			success: function(response){
				$('.container').prepend("<ul><div id='cohort-list-div'><item id='list-cohort-li'><a href = 'cohort/" + response.cohort_name + "'>" + response.cohort_name + "</a></item></div></ul>");
				document.getElementById("add-cohort-form").reset();
				alert('Cohort added!');
				console.log("Success entry:", response.cohort_name);
			},
			error: function(){
				console.log("****New Cohort Error****");
			}
		}) //end ajax
	});

// ===========================================================================================

//hides and unhides "New Student" form
	$('.new-student-button').on('click', function(event){
		var item = document.getElementById('student-register-div')
		var student =document.getElementsByClassName('new-student-button')		
		if (item.className=='hidden'){
			item.className='unhidden';
			student.innerHTML='Hide Form';
			student.id='hidden';
		} else {
			item.className ='hidden';
			student.innerHTML= 'Add student';
			student.id ='id', 'new-student-button';
		}
	});

//ajax for "New Student" form
	$('#register-student').on('click', function(event){
		event.preventDefault();
		console.log("register student form submitted!");
		kwargs = {
				"first_name": $('input[name="first_name"]').val(),
				"last_name": $('input[name="last_name"]').val(),
				"cohort_name": $('.cohort_name').attr('id'),
				"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val(),
			};
		$.ajax({
			url: "/register_student",
			type: "POST",
			data: kwargs,
			success: function(response){
				console.log("=========Success function reached!=========");
				console.log("kwargs:",kwargs);
				$('.student-list').prepend(
					`<li class="individual-student">
						<div class="cohort-detail-student-name-div">
							<a class="username" id="`
							+ response.first_name + "." + response.last_name +
							`" href="/profile/`
							+ response.first_name + "." + response.last_name + 
							`">`
							+ response.first_name + " " + response.last_name + 
							`</a>
						</div>
						<form method = 'post' class="student-radio-tags" id="`
							+ response.first_name + "." + response.last_name +
						`">
							<div class="btn-group btn-group-justified" data-toggle="buttons">
								<label class="btn btn-primary">
									<input type="radio" class="radio" name="student-attendance" autocomplete="off" value="present">Present
								</label>
								<label class="btn btn-primary">
									<input type="radio" class="radio" name="student-attendance" autocomplete="off" value="unexcused">Unexcused
								</label>
								<label class="btn btn-primary">
									<input type="radio" class="radio" name="student-attendance" autocomplete="off" value="excused">Excused
								</label>
								<label class="btn btn-primary">
									<input type="radio" class="radio" name="student-attendance" autocomplete="off" value="late">Late
								</label>
							</div>
						</form>
					</li>
				`);
				console.log("AJAX Register Student - Success!:", response.first_name);
				document.getElementById("add-student-form").reset();
				
			},
			error: function(){
				console.log("****New Student AJAX Error****");
			}	
		}) //end ajax
	}); //end func

// ===========================================================================================

//ajax for "Take-attendance-button" form
	$('.take-attendance-button').on('click', function(event){
		event.preventDefault();
		console.log("Submit Attendance Button Clicked!");
		remove_popover();

		var student_names_obj = {};
		$(".username").each(function() {
		    id = $(this).attr('id');
		    status = $(this).parent().next().children('.btn-group').children('.active').children().val();
		    // status = $(this).parent().next().children(':checked').val();
		    student_names_obj[id] = status;
		});
		var date_value = $('.take-attendance-button').attr('value');
		var kwargs = {
					"student_names_obj": student_names_obj,
					"date_value": $('.take-attendance-button').attr('value'),
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
		};
		console.log("pre-ajax kwargs:", kwargs)

		//ajax call to send user date data to DB
		$.ajax({
			url: "/take_attendance",
			type: "POST",
			data: kwargs,
			success: function(response){
				// $('li.individual-student').css('background-color',"green");
				console.log("Error msg:",response.error_msg);
				if (response.error_msg !== undefined) {
					alert("You forgot to fill out the following student's attendance:\n"+response.error_msg);
				} else {
					alert('Attendance updated!');
				}
			},
			error: function(){
				console.log("****Submit Attendance AJAX Error****");
			}	
		}) //end ajax
	}); //end func



///////////PROFILE DETAIL VIEW JS///////////////
// =============================================


//makes the  final project form appear and dissapear 
	$('#final_project').on('click', function(event){
		var item = document.getElementById('final_form_div')
		if (item.className=='hidden'){
			item.className='unhidden';
		} else {
			item.className ='hidden';
		}
	});
//makes the  Student bio form appear and dissapear
	$('#bio_title').on('click', function(event){
		var item = document.getElementById('bio_update_div')
		if (item.className=='hidden'){
		item.className='unhidden';
		} else {
		item.className ='hidden';
		}
	});

//ajax for "Submit-BIO-button" form
	$('#bio-btn').on('click', function(event){
		event.preventDefault();

		var kwargs = {
		   'bio' : $('#bio-input').val(),
		   'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
		   'user': $('h1#id_username').text(),
		}

		$.ajax({
			url: "/update_bio",
			type: "POST",
			data: kwargs,
			success: function(response){
				// $('li.individual-student').css('background-color',"green");
				console.log(response)
				$('#bio_title').next().html(response['bio'])
				
			},
			error: function(){
				console.log("****AJAX Error****");
			}	
		}) //end ajax
	}); //end func

//ajax for "Final-Project-button" form
	$('#final-btn').on('click', function(event){
		event.preventDefault();
		var kwargs = {
			'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
			'user': $('h1#id_username').text(),
			'final_project': $('#final_proj_input').val()
		}

		//ajax call final project
		$.ajax({
			url: "/update_final_project",
			type: "POST",
			data: kwargs,
			success: function(response){
				// $('li.individual-student').css('background-color',"green");
				$('#final_project').next().html(response['final_project'])
			},
			error: function(){
				console.log("****AJAX Error****");
			}	
		}) //end ajax
	}); //end func


	$('.list-item').on("click", function(event){
	 	event.preventDefault();
	 	console.log("clicked")
	 	var item = $(this).next()
		if (item.hasClass('hidden')){
		item.removeClass('hidden')
		item.addClass('unhidden')
		} else {
		item.removeClass('unhidden')
		item.addClass('hidden')

		}
	});

	$('label.btn-primary').on("dblclick", function(event){
		event.preventDefault();
		console.log('button clicked')

	 	var kwargs = {
	 		'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"').val(),
	 		'user':$('h1#id_username').text(),
	 		'date': $(this).parent().parent().prev().attr('data-id'),
	 		'oldstatus': $(this).parent().parent().prev().children().next().attr('data-id'),
	 		'status': $(".active input[name='profile-attendance']").val()
	 	}
	 	console.log(kwargs)

	 	date = kwargs['date']

	 	// ajax submit 
	 	$.ajax({
	 		url:"/update_profile_attendance",
	 		type: "POST",
	 		data: kwargs,
	 		success: function(response){
	 			console.log(response)
	
	 			// console.log($(this).parent().parent().prev().attr('data-id'))
	 			// $(this).parent().parent().prev().children().next().html(response['status'])
	 		},
	 		error: function(response){
	 			console.log(response['err'])
	 		}
	 	});


	});




}); //end doc
