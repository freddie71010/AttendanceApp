$(document).ready(function(){
console.log("js loaded!")
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
	})

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
				console.log("Error");
			}
		}) //end ajax
	});

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
				console.log(kwargs);	//ERROR:::::::::CSRF token is coming back as undefined!
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
						<form class="student-checkbox-tags">
							<input type = "hidden" name = "csrfmiddlewaretoken" value = "`
							+ response.csrfmiddlewaretoken +
							`">
							<label>Present</label>
							<input type="checkbox" class="checkbox" name="present" value="present" checked>
							<label>Unexcused</label>
							<input type="checkbox" class="checkbox" name="unexcused" value="unexcused">
							<label>Excused</label>
							<input type="checkbox" class="checkbox" name="excused" value="excused">
							<label>Late</label>
							<input type="checkbox" class="checkbox" name="late" value="late">
						</form>
					</li>
				`);
				console.log("AJAX register student - success!:", response.first_name);
				document.getElementById("register-student-form").reset();
				
			},
			error: function(){
				console.log("Error");
			}	
		}) //end ajax
	});

// ////// DATE PICKER

   // $( "#datepicker-2" ).datepicker();

   $( "#datepicker" ).datepicker({
  beforeShowDay: $.datepicker.noWeekends
});

// !!!!!!!!!!!!!!!!



//ajax for "Take-attendance-button" form
	$('.take-attendance-button').on('click', function(event){
		event.preventDefault();
		console.log("submit attendance button clicked!");

		var student_names_obj = {};
			$(".username").each(function() {
			    student_names_obj[$(this).attr('id')] = $(this).parent().next().children(':checked').val();
			});



		// !!!!!! Still working on the above code bloack need to grab date to make this work.

		console.log(student_names_obj)


		$.ajax({
			url: "/take_attendance",
			type: "post",
			data: student_names_obj,
			success: function(response){
	
				console.log("AJAX register student - success!:", response.first_name);
				
			},
			error: function(){
				console.log("Error");
			}	
		}) //end ajax
	});



	});
