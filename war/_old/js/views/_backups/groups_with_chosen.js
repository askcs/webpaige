function editMember(uuid)
{
	$('#editMember').modal('hide');
  
	var uuid = $('#editMember #uuid').val();
			  	
	webpaige.con(
		options = {
			path: '/parent?uuid='+uuid,
			loading: 'Parent groep informatie wordt opgeladen..',
			label: 'parent group: '
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  
	  	var ugroups = [];
	  	for (var i in data)
	  	{
		  	ugroups.push(data[i].uuid);
	  	}
	  	
	  	webpaige.config('ugroups', ugroups);
	  	
	  	var counter = e.length;
	  	for (var e in data)
	  	{
	  		console.log('del: ', data[e].uuid);
				webpaige.con(
					options = {
						type: 'delete',
						path: '/network/'+data[e].uuid+'/members/'+uuid,
						loading: 'Gebruiker groepen aangepast..',
						label: 'Contact is verwijderd.'
						,session: session.getSession()	
					},
					function(data, label)
				  { 
				  
				  	counter = counter -1;
				  	if(counter == 0)
				  	{
							var groups = $('#groupsListEdit select').val();
							var ugroups = webpaige.config('ugroups');
							
							for (var i in groups)
							{
								if(jQuery.inArray(groups[i], ugroups) == -1)
								{
									webpaige.con(
										options = {
											type: 'post',
											path: '/network/'+groups[i]+'/members/'+uuid,
											loading: 'Contact wordt toegevoegd in groep..',
											label: 'Contact is toegevoegd in groep.'
											,session: session.getSession()	
										},
										function(data, label)
									  {  
										}
									);
								}
							}
				  	}
				  	
					}
				);
	  	}	
	  			
		}
	);
	
	
	
	
	
	
	
	
/*
	for (var h in groups)
	{
		console.log('added :', groups[h]);
		
		webpaige.con(
			options = {
				type: 'post',
				path: '/network/'+groups[h]+'/members/'+uuid,
				loading: 'Contact wordt toegevoegd in groep..',
				label: 'Contact is toegevoegd in groep.'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
			}
		);
	}	
*/
	
	
	
	var role = $('#editMember #roles').val();
	var name = $('#editMember #name').val();	
	var tel = $('#editMember #tel').val();	
	var email = $('#editMember #email').val();
	var address = $('#editMember #address').val();
	var postcode = $('#editMember #postcode').val();
	var city = $('#editMember #city').val();
	var guuid = $('#editMember #guuid').val();
  	
  var tags = '{' +
  	'"role":"' + role + '", ' +
  	'"name":"' + name + '", ' +
  	'"PhoneAddress":"' + tel + '", ' +
  	'"EmailAddress":"' + email + '", ' +
  	'"PostAddress":"' + address + '", ' +
  	'"PostZip":"' + postcode + '", ' +
  	'"PostCity":"' + city + '"' +
  	'}';
  	
  //console.log('role :', role);
					
		
	webpaige.con(
		options = {
			type: 'put',
			path: '/node/'+uuid+'/resource',
			json: tags,
			loading: 'Contact informatie wordt opgeslagen..',
			message: 'Contact informatie is gewijzigd.',
			label: 'member'
			,session: session.getSession()	
		},
		function(data, label)
	  { 
			// get group name for displaying later
			webpaige.con(
				options = {
					path: '/network/'+guuid,
					loading: 'Contacten worden opgeladen..',
					label: 'members'
					,session: session.getSession()	
				},
				function(data, label)
			  {
			  	// depreciated because parsing happens in the main function
			  	//data = JSON.parse(data);	
	
			  	/*
					var groups = $('#groupsListEdit select').val();
					for (var h in groups)
					{
						console.log('added :', groups[h]);
						
						webpaige.con(
							options = {
								type: 'post',
								path: '/network/'+groups[h]+'/members/'+uuid,
								loading: 'Contact wordt toegevoegd in groep..',
								label: 'Contact is toegevoegd in groep.'
								,session: session.getSession()	
							},
							function(data, label)
						  {  
							}
						);
					}	
					*/	
	  	
	  			loadGroups(guuid, data.name); 
			  }
			);
		}
	);
	
	
	
}
