//(function(){
	//'use strict';

	window.addEventListener( 'load', windowInit, false );
	
	function windowInit()
	{
	 	pageInit('profile', 'true');
	  renderProfile();
	  addEventListeners();	


		var local = {
			title: 'profile_title',
			statics: ['profile_edit_profile', 'profile_change_password', 'profile_update_profile', 'profile_profile_name', 'profile_email_address', 'profile_phone_number', 'profile_address', 'profile_postcode', 'profile_city', 'profile_cancel', 'profile_save_profile', 'profile_old_password', 'profile_new_password', 'profile_new_password_repeat', 'profile_close', 'profile_changed']		
		}
		webpaige.i18n(local);
		
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
				loading: 'Gebruiker informatie wordt opgeladen..',
				label: 'resources',
				session: session.getSession()	
			},
			function(data, label)
		  {  	
			 	var name = (data.name != undefined) ? data.name : 'Er is nog geen namen toegevoegd.';
			 	var email = (data.EmailAddress != undefined) ? data.EmailAddress : 'Er is nog geen adres toegevoegd.';
			 	var phone = (data.PhoneAddress != undefined) ? data.PhoneAddress : 'Er is nog geen telefoonnummer toegevoegd.';
			 	var address = (data.fullPostAddress != undefined) ? data.fullPostAddress : 'Er is nog geen adres toegevoegd.';
			 	$('#live').remove();
				var live = $('<div id="live"></div>');
				var para = $('<p></p>');
				var dl = $('<dl></dl>');
				dl.append('<dt>Emailadres:</dt>');
				dl.append('<dd>'+email+'</dd>');
				dl.append('<dt>Telefoonnummer:</dt>');
				dl.append('<dd>'+phone+'</dd>');
				dl.append('<dt>Straat:</dt>');
				dl.append('<dd>'+data.PostAddress+'</dd>');
				dl.append('<dt>Postcode:</dt>');
				dl.append('<dd>'+data.PostZip+'</dd>');
				dl.append('<dt>Stad:</dt>');
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
				loading: 'Gebruiker informatie wordt opgeladen..',
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
	    $("#changePassword #alertMessage").html("<strong>Wachtwoord wijzigen is mislukt!</strong><br>Graag vul de alle verplichte velden.");
	    return false;
	  }
	  
	  if (pass1 != pass2)
	  {
	    $("#changePassword #alertDiv").show();
	    $("#changePassword #alertMessage").html("<strong>Wachtwoord wijzigen is mislukt!</strong><br>Wachtwoorden komen niet overeen. Probeer het opnieuw.");
	    return false;
	  }
	  else
	  {
	  	var pass = pass1;
	  }
	  
		webpaige.con(
			options = {
				path: '/resources',
				loading: 'Gebruiker informatie wordt opgeladen..',
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
							loading: 'Wachtwoord wordt gewijzigd..',
							message: 'Wachtwoord is gewijzigd.',
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
									loading: 'Sense Wachtwoord wordt gewijzigd..',
									message: 'Sense Wachtwoord is gewijzigd..',
									session: sense.session,
									credentials: false,
									label: 'sensors'
								},
								function(data, label)
							  {
					    		$("#changePassword #successDiv").show();
					    		$("#changePassword #successMessage").html("<strong>Wachtwoord is gewijzigd!</strong><br>Uw nieuwe wachtwoord is ingesteld.");
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
	    		$("#changePassword #alertMessage").html("<strong>Wachtwoord wijzigen is mislukt!</strong><br>U hebt een verkeerd wachtwoord getypt.");
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
				loading: 'Gebruiker informatie wordt gewijzigd..',
				message: 'Gebruiker informatie is gewijzigd.',
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