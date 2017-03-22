$(document).ready(function(){
	console.log("datatables.js loaded!")

	//Sets up DataTable on Students page
	$('#allstudents').DataTable( {
		"iDisplayLength": 25,						//default # of entries per page: 25
	    "order": [[ 5, 'desc' ], [ 1, 'asc' ]]		//Sort by: Cohort Start Date (desc), then Last name(asc)
	});

});