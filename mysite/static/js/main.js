$(document).ready(function(){
	console.log("js loaded!")

// ON LOAD ===========================================================================================

//Sets calendar values on Cohort Detail page
	var now = moment();
	var start_of_week = now.startOf('week');
	$('#todays-date').html("Week of " + start_of_week.format("MMMM D, YYYY"));
	date_loop(start_of_week);

	//defaults settings as if the current day was selected - background color to yellow, button value set as today's date
	onload_sets_todays_date();


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
				$('.take-attendance-button').attr('value', todays_date.format('MM-DD-YYYY'));
			}
		}
	} //end func

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
		diff = $(this).index();
		$('ul.cal-numdays li').removeAttr("style id");
		$(this).css("background-color","yellow");
		clicked_date = $(this).text();
		start_of_week.add(diff,'d');
		$('.take-attendance-button').removeAttr('disabled');
		$('.take-attendance-button').attr('value', start_of_week.format('MM-DD-YYYY'));
		$('.take-attendance-button').html("<span class='glyphicon glyphicon-plus'></span> Submit Attendance - " + start_of_week.format('ddd, MMM D'));
		
		console.log(
			"clicked_date:\t", clicked_date,
			"\tstart_of_week:\t", start_of_week.format('MMM D'),
			"\ndiff:\t",diff,
			"\n======================================"
			);		

		start_of_week.subtract(diff,'d');
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
			},
		$.ajax({
			url: "/register_cohort",
			type: "post",
			data: kwargs,
			success: function(response){
				$('.cohort-list').prepend("<ul><li><a href = 'cohort/" + response.cohort_name + "'>" + response.cohort_name + "</a></li></ul>");
				console.log("Success entry:", response.cohort_name)
				document.getElementById("add-cohort-form").reset();
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
			type: "post",
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
						<form class="student-radio-tags">
							<input type = "hidden" name = "csrfmiddlewaretoken" value = "`
							+ response.csrfmiddlewaretoken +
							`">
							<label>Present</label>
							<input type="radio" class="radio" name="student-attendance" value="present" checked="true">
							<label>Unexcused</label>
							<input type="radio" class="radio" name="student-attendance" value="unexcused">
							<label>Excused</label>
							<input type="radio" class="radio" name="student-attendance" value="excused">
							<label>Late</label>
							<input type="radio" class="radio" name="student-attendance" value="late">
						</form>
					</li>
				`);
				console.log("AJAX Register Student - Success!:", response.first_name);
				document.getElementById("register-student-form").reset();
				
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

		var student_names_obj = {};
		$(".username").each(function() {
		    id = $(this).attr('id');
		    status = $(this).parent().next().children(':checked').val();
		    student_names_obj[id] = status;
		});
		var date_value = $('.take-attendance-button').attr('value');
		var kwargs = {
					"student_names_obj": student_names_obj,
					"date_value": $('.take-attendance-button').attr('value'),
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
		};
		console.log("kwargs:", kwargs)

		$.ajax({
			url: "/take_attendance",
			type: "post",
			data: kwargs,
			success: function(response){
				$('li.individual-student').css('background-color',"green");
				alert('Attendance form submitted!');
			},
			error: function(){
				console.log("****Submit Attendance AJAX Error****");
			}	
		}) //end ajax
	}); //end func







}); //end doc
