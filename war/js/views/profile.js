//(function(){
	//'use strict';

	window.addEventListener( 'load', windowInit, false );
	
	function windowInit()
	{
	 	pageInit('profile', 'true');
	  renderProfile();
	  addEventListeners();		
	}

	function addEventListeners()
	{
		document.getElementById('alertClose').addEventListener('click', closeAlerts, false);
		document.getElementById('updateProfileTrigger').addEventListener('click', updateProfile, false);
	}
	
	function closeAlerts()
	{
		$("#alertDiv").hide();		
	}
	
	
	function renderProfile()
	{ 
		webpaige.con(
			options = {
				path: '/resources',
				loading: 'Loading resources..',
				label: 'resources',
				session: session.getSession()	
			},
			function(data, label)
		  {  	
			 	var name = (data.name != undefined) ? data.name : 'No name is given yet.';
			 	var email = (data.EmailAddress != undefined) ? data.EmailAddress : 'No email address is given yet.';
			 	var phone = (data.PhoneAddress != undefined) ? data.PhoneAddress : 'No phone number is set.';
			 	var address = (data.fullPostAddress != undefined) ? data.fullPostAddress : 'No address is set.';
			 	$('#live').remove();
				var live = $('<div id="live"></div>');
				var para = $('<p></p>');
				var dl = $('<dl></dl>');
				dl.append('<dt>Email address:</dt>');
				dl.append('<dd>'+email+'</dd>');
				dl.append('<dt>Telephone number:</dt>');
				dl.append('<dd>'+phone+'</dd>');
				dl.append('<dt>Street:</dt>');
				dl.append('<dd>'+data.PostAddress+'</dd>');
				dl.append('<dt>Postcode:</dt>');
				dl.append('<dd>'+data.PostZip+'</dd>');
				dl.append('<dt>City:</dt>');
				dl.append('<dd>'+data.PostCity+'</dd>');
				para.append(dl);
				$(live).append(para);
				$('#content').html(live);
			}
		);	
	}
	
	function updateProfile()
	{
		webpaige.con(
			options = {
				path: '/resources',
				loading: 'Loading resources..',
				label: 'resources',
				session: session.getSession()	
			},
			function(data, label)
		  {  	
	  		$('#updateProfile').modal('show');
			  $('#name').val(data.name); 
			  $('#email').val(data.EmailAddress); 
			  $('#phone').val(data.PhoneAddress); 
			  $('#address').val(data.PostAddress); 
			  $('#postcode').val(data.PostZip); 
			  $('#city').val(data.PostCity); 
			}
		);	
	}
	
	function changePassword()
	{
		var old_pass = $('#pass').val();
		var pass1 = $('#pass1').val();
		var pass2 = $('#pass2').val();
	  
	  if (pass1 == '' || pass2 == '')
	  {
	    $("#changePassword #alertDiv").show();
	    $("#changePassword #alertMessage").html("<strong>Password reset failed!</strong><br>Please fill the compulsory fields.");
	    return false;
	  }
	  
	  if (pass1 != pass2)
	  {
	    $("#changePassword #alertDiv").show();
	    $("#changePassword #alertMessage").html("<strong>Password reset failed!</strong><br>Passwords do not match. Please try again.");
	    return false;
	  }
	  else
	  {
	  	var pass = pass1;
	  }
	  
		webpaige.con(
			options = {
				path: '/resources',
				loading: 'Loading resources..',
				label: 'resources',
				session: session.getSession()	
			},
			function(data, label)
		  {  	
	  		if (data.askPass == MD5(old_pass))
	  		{
				  var tags = '{' + '"askPass":"' + MD5(pass) + '"' + '}';
					webpaige.con(
						options = {
							type: 'post',
							path: '/resources?tags=' + tags,
							loading: 'Changing password..',
							message: 'Successfully changed password',
							label: 'resources'
							,session: session.getSession()	
						},
						function(data, label)
					  {
					  	var body = '{' +				  		
								'"current_password":"' + MD5(old_pass) + '",' +
								'"new_password":"' + MD5(pass) + '"' +
					  	'}'; 
							var sense = webpaige.get('sense');
							sense = sense ? JSON.parse(sense) : undefined;
							webpaige.con(
								options = {
									host: 'http://api.sense-os.nl',
									path: '/change_password.json',
									type: 'post',
									json: body,
									loading: 'Changing Sense password..',
									message: 'Sense password changed..',
									session: sense.session,
									credentials: false,
									label: 'sensors'
								},
								function(data, label)
							  {
					    		$("#changePassword #successDiv").show();
					    		$("#changePassword #successMessage").html("<strong>Password changed!</strong><br>Your new password is set up.");
					    		$('#changePassword #changePasswordButtons').hide();
					    		$('#changePassword #passwordChangedButton').show();
								}
							);
						}
					);
	  		}
	  		else
	  		{
	    		$("#changePassword #alertDiv").show();
	    		$("#changePassword #alertMessage").html("<strong>Password reset failed!</strong><br>You typed a wrong password.");
	  		}
			}
		);
			
	}
	
	function changeResources()
	{
	  var name = $('#name').val(); 
	  var phone = $('#phone').val(); 
	  var address = $('#address').val(); 
	  var postcode = $('#postcode').val(); 
	  var city = $('#city').val(); 
	  $('#updateProfile').modal('hide');
	  var tags = '{' +
	  	'"name":"' + name + '", ' +
	  	'"PhoneAddress":"' + phone + '", ' +
	  	'"PostAddress":"' + address + '", ' +
	  	'"PostZip":"' + postcode + '", ' +
	  	'"PostCity":"' + city + '"' +
	  	'}';
		webpaige.con(
			options = {
				type: 'post',
				path: '/resources?tags=' + tags,
				loading: 'Changing resources..',
				message: 'Successfully change a resource',
				label: 'resources'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
	      $("#profileChanged").show();
	    	renderProfile();
			}
		);
	}
	
//})();