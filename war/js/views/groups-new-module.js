(function(){
	//'use strict';

	window.addEventListener( 'load', windowInit, false );
	
	function windowInit()
	{
	 	pageInit('groups', 'true');
	 	loadGroups();
	  //addEventListeners();
	  
	  $("#searchResults").hide();
	  $("#alertDiv").hide();		
 	
	 	$('#groupsList').click(function()
	 	{
	 		$("#members").show();
	 		$("#searchResults").hide();
	  	$("#alertDiv").hide();
	  	$('#q').val("");
	 	});
	 	
	 	$("#searchMemberBtn").click(function()
	 	{
	 		var value = $('#q').val();
	 		searchMembers(value);
	 	});
	
		$('#groupSubmit').click(function()
	  {
	  	addGroup();
	  });
	
		$('#saveNewMember').click(function()
	  {
	  	saveNewMember();
	  });
	
		$('#editMemberBtn').click(function()
	  {
	  	editMember();
	  });
		
	
	  $('#editGroupSubmitter').click(function()
	  {
	    $('#editGroup').modal('hide');
	    var editGroupName = $('#editGroupName').val();
	    var uuid = $('#editGroupUUID').val();
	    $('#editGroupForm')[0].reset();
			updateGroup(editGroupName, uuid);
	  });
	
	  $('#deleteGroupBtn').click(function()
	  {
	    $('#editGroup').modal('hide');
	    var editGroupUUID = $('#editGroupUUID').val();
	    $('#editGroupForm')[0].reset();
	    deleteGroup(editGroupUUID);
	  });
	  
	  
		$('#groupBtn').click(function(){ alert('inbox'); });
	  
	}


	function addEventListeners()
	{
		
		$('#groupBtn').click(function() { 
			//console.log($(this).val( $(this).attr("data-uuid") ));
			alert('yeah');
		});
		//document.getElementById('alertClose').addEventListener('click', closeAlerts, false);
		//document.getElementById('updateProfileTrigger').addEventListener('click', updateProfile, false);
	}
	
	
	
	function loadGroups(uuid, name)
	{
		webpaige.con(
			options = {
				path: '/network',
				loading: 'Loading groups..',
				label: 'groups'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
	    	renderGroups(data, uuid, name);
			}
		);
		/*
		var cache = ASKCache("getGroups",'/network',null, 'uuid', session);
		cache.addRenderer('group.html',function(json, oldData, data){
				renderGroups(json, uuid, name);
		});
		*/
	}
	
	
	function addGroup()
	{
	  $('#newGroup').modal('hide');
	  var name = $('#newGroupName').val();
	  $('#newGroupForm')[0].reset();
	  var resources = JSON.parse(localStorage.getItem('resources')); 	
	  var body = '{"name": "' + name + '"}';	
		webpaige.con(
			options = {
				type: 'post',
				path: '/network/'+resources.uuid,
				loading: 'Adding new group..',
				json: body,
				message: 'Group added.',
				label: 'groups'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
	    	loadGroups(data, name);
			}
		);
	}
	
	
	function updateGroup(name, uuid)
	{
	  var body = '{"name": "' + name + '"}';	
		webpaige.con(
			options = {
				type: 'put',
				path: '/network/'+uuid,
				loading: 'Updating group..',
				json: body,
				message: 'Group updated.',
				label: 'groups'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
	    	loadGroups(uuid, name);
			}
		);
	}
	
	
	function editGroupModalInit(name, uuid)
	{
	  $('#editGroup').modal('show');
	  var editGroupName = $('#editGroupName').val(name);	
	  var editGroupUUID = $('#editGroupUUID').val(uuid);			
	}
	
	
	function deleteGroup(uuid)
	{
		webpaige.con(
			options = {
				type: 'delete',
				path: '/network/'+uuid,
				loading: 'Deleting group..',
				message: 'Group deleted',
				label: 'groups'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
		  	loadGroups();
			}
		);
	}
	
	
	function searchMembers(value)
	{
	  var body = '{"key":"' + value + '"}';
		webpaige.con(
			options = {
				type: 'post',
				path: '/network/searchPaigeUser',
				json: body,
				loading: 'Searching for members..',
				label: 'searched'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
				renderSearch(data);
	  		renderAddGroupsList(window.groups);
			}
		); 
	}
	
	
	function loadMembers(name, uuid)
	{
		webpaige.con(
			options = {
				path: '/network/'+uuid+'/members',
				loading: 'Loading members..',
				label: 'members'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
	  		$('#live').remove();
		  	renderMembers(data, name, uuid);
			}
		);
	}
	
	
	function addMembers()
	{
		var uuid = $('#groupsAddList option:selected').val();
	  var values = $('.search input:checkbox:checked').map(function ()
	  {
		  if (this.value != 'on')
		  {
				webpaige.con(
					options = {
						type: 'post',
						path: '/network/'+uuid+'/members/'+this.value,
						loading: 'Adding member(s)..',
						label: 'Member(s) added'
						,session: session.getSession()	
					},
					function(data, label)
				  {  
			  		loadGroups(uuid);
					}
				); 
		  }
		}).get();
	}
	
	
	function addNewMemberToGroup(name, uuid)
	{
		$('#newMember').modal('show');
		$('#newMember h3').html('New member (' + name + ')');
		$('#newMember #guuid').val(uuid);
	}
	
	
	function saveNewMember()
	{
		$('#newMember').modal('hide');
		var fname = $('#newMember #fname').val();
		var lname = $('#newMember #lname').val();
		var name = fname + ' ' + lname;
		var tel = $('#newMember #tel').val();
		var uuid = $('#newMember #email').val();
		var pass = $('#newMember #pass').val();
		var guuid = $('#newMember #guuid').val();
		
		// get group name for displaying later
		webpaige.con(
			options = {
				path: '/network/'+guuid,
				loading: 'Loading members..',
				label: 'members'
				,session: session.getSession()	
			},
			function(data, label)
		  {
		  	var data = JSON.parse(data);  
	  		var gname = data.name;
	  		
	  		// register user in ask
				webpaige.con(
					options = {
						path: '/register?uuid=' + uuid + '&pass=' + MD5(pass) + '&name=' + name + '&phone=' + tel + '&direct=true&module=default',
						loading: 'Registering new user..',
						label: 'New member'
						,session: session.getSession()	
					},
					function(data, label)
				  {
				    // add user to the group
						webpaige.con(
							options = {
								type: 'post',
								path: '/network/'+guuid+'/members/'+uuid,
								loading: 'Adding member to the group..',
								label: 'Member added to the group'
								,session: session.getSession()	
							},
							function(data, label)
						  {  
					  		loadGroups(guuid, gname);
		
								var body = {};
								var user = {};
								user.email = uuid;
								user.username = uuid;
								user.name = fname;
								user.surname = lname;
								user.mobile = tel;
								user.password = MD5(pass);
								
								body.user = user;
								
								var body = JSON.stringify(body);
								
								var sense = JSON.parse(webpaige.get('sense'));
								
					  		// register user in sense environment
								webpaige.con(
									options = {
										host: 'http://api.sense-os.nl',
										path: '/users.json',
										type: 'post',
										json: body,
										loading: 'Registering user in Sense environment..',
										message: 'User registered in Sense.',
										//session: sense.session,
										session: null,
										credentials: false,
										label: 'Sense account'
									},
									function(data, label)
								  {
								  	console.log('Sense registration is successful..');  
									}
								);
								
							}
						);
						
					}
				);
		
			}
		);
		
	}
	
	
	function editMemberModalInit(guuid, uuid)
	{
		webpaige.con(
			options = {
				path: '/node/'+uuid+'/resource',
				loading: 'Getting resources of the member..',
				message: 'Resources are obtained.',
				label: 'resource'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
				$('form#editMemberForm')[0].reset();
	  		$('#editMember').modal('show');
	  		$('#editMember #name').val(data.name);	
	  		$('#editMember #tel').val(data.PhoneAddress);	
	  		$('#editMember #email').val(data.EmailAddress);	
	  		$('#editMember #address').val(data.PostAddress);	
	  		$('#editMember #postcode').val(data.PostZip);	
	  		$('#editMember #city').val(data.PostCity);	
	  		$('#editMember #country').val(data.PostCountry);	
	  		$('#editMember #uuid').val(data.uuid);	
	  		$('#editMember #guuid').val(guuid);	
			}
		);	
	}
	
	
	
	function editMember()
	{
		$('#editMember').modal('hide');
		var name = $('#editMember #name').val();	
		var tel = $('#editMember #tel').val();	
		var email = $('#editMember #email').val();
		var address = $('#editMember #address').val();
		var postcode = $('#editMember #postcode').val();
		var city = $('#editMember #city').val();
		var country = $('#editMember #country').val();
		var uuid = $('#editMember #uuid').val();
		var guuid = $('#editMember #guuid').val();
	  	
	  var tags = '{' +
	  	'"name":"' + name + '", ' +
	  	'"PhoneAddress":"' + tel + '", ' +
	  	'"EmailAddress":"' + email + '", ' +
	  	'"PostAddress":"' + address + '", ' +
	  	'"PostZip":"' + postcode + '", ' +
	  	'"PostCity":"' + city + '", ' +
	  	'"PostCountry":"' + country + '"' +
	  	'}';
			
		webpaige.con(
			options = {
				type: 'put',
				path: '/node/'+uuid+'/resource',
				json: tags,
				loading: 'Saving member information..',
				message: 'Member information is updated.',
				label: 'member'
				,session: session.getSession()	
			},
			function(data, label)
		  { 
				// get group name for displaying later
				webpaige.con(
					options = {
						path: '/network/'+guuid,
						loading: 'Loading members..',
						label: 'members'
						,session: session.getSession()	
					},
					function(data, label)
				  {
		  			loadGroups(guuid, data.name); 
				  }
				);
			}
		);	
	}
	
	
	
	function removeMembers(uuid)
	{
		var specificTable = '#tb-' + uuid + ' input:checkbox:checked';
	  var values = $(specificTable).map(function ()
	  {
		  if (this.value != 'on')
		  {
		  	removeMember(uuid, this.value);
		  }
		}).get();
	}	
	
	
	function removeMember(uuid, memberUuid)
	{
		webpaige.con(
			options = {
				type: 'delete',
				path: '/network/'+uuid+'/members/'+memberUuid,
				loading: 'Removing member(s)..',
				label: 'Member(s) removed.'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
	  		loadGroups(uuid, name);
			}
		);
	}
	
		
	function toggleChecked(uuid, status)
	{
		var ids = "#tb-" + uuid.replace(/([@.:#])/g, '\\$1') + " input"; 
		$(ids).each( function()
		{
			$(this).attr("checked",status);
		})
	}
	
	
	
	
	
	
	
	
	
	
	
	function renderGroups(data, uuid, name)
	{
		window.groups = data;
		
		$('#groupsList').remove();
		
		var groupsList = $('<ul id="groupsList" class="nav nav-list"></ul>');
	  $(groupsList).append('<li class="nav-header">Groups</li>');
	   
	  for (var i in data)
	  {
	  	if (uuid == null && name == null && i==0)
	  	{
	  		$(groupsList).append('<li class="active"><a id="groupBtn" group-uuid="'+data[i].uuid+'" group-name="'+data[i].name+'">'+data[i].name+'</a></li>');
	  		var uuid = data[i].uuid;
	  		var name = data[i].name;
	  	}
	  	else
	  	{
	  		if (uuid == data[i].uuid)
	  		{
	  			var active = ' class="active"';
	  		}
	  		else
	  		{
	  			var active = '';
	  		}
	  		$(groupsList).append('<li'+active+'><a id="groupBtn" group-uuid="'+data[i].uuid+'" group-name="'+data[i].name+'">'+data[i].name+'</a></li>');
				var uuid = uuid;
				var name = name;	
	  	}
	  }
	  
	  $('#groupsNav').html(groupsList);
	  loadMembers(name, uuid);
	}
	
	
	
	function renderMembers(json, name, uuid)
	{
	 	var data = json ? JSON.parse(json) : undefined;
	 	
	 	$('#live').remove();
	 	
		var live = $('<div id="live"></div>');
		
	  var btnGroup = $('<div class="btn-group btn-hanging"></div>');
	  
	  $(btnGroup).append('<a onClick="addNewMemberToGroup(\''+name+'\', \''+uuid+'\')" class="btn"><i class="icon-user"></i> Add new member</a>');
	  
	  $(btnGroup).append('<a onClick="editGroupModalInit(\''+name+'\', \''+uuid+'\')" class="btn"><i class="icon-edit"></i> Edit group</a>');
	  
	  $(btnGroup).append('<a onClick="deleteGroup(\''+uuid+'\')" class="btn"><i class="icon-remove"></i> Delete group</a>');
	  
	  $(live).append(btnGroup);
	  
	  var title = $('<h2><span class="entypo eMedium">,</span> '+name+'</h2><br>');  
	  
	  $(live).append(title);
	  
	 	if (data && data.length > 0)
	 	{
			var table = $('<table id="tb-'+uuid+'" class="table table-striped"></table>');
			var thead = $('<thead><tr></tr></thead>');
			thead.append('<th><input type="checkbox" onclick="toggleChecked(\''+uuid+'\', this.checked)" /></th>');
			thead.append('<th>Name</th>');
			thead.append('<th>Email</th>');
			thead.append('<th>Phone</th>');
			thead.append('<th></th>');
			table.append(thead);
			var tbody = $('<tbody></tbody>');
	    for(var n in data)
	    {
	    	var tbodytr = $('<tr></tr>');
				tbodytr.append('<td><input type="checkbox" class="checkbox" value="'+data[n].uuid+'" /></td>');
				tbodytr.append('<td><a onclick="editMemberModalInit(\''+uuid+'\', \''+data[n].uuid+'\');">'+data[n].name+'</a></td>');
				tbodytr.append('<td>'+data[n].resources.EmailAddress+'</td>');
				tbodytr.append('<td>'+data[n].resources.PhoneAddress+'</td>');
				tbodytr.append('<td><a class="btn btn-mini" onclick="removeMember(\''+uuid+'\', \''+data[n].uuid+'\');"><i class="icon-trash"></i></a></td>');
				tbody.append(tbodytr);
	    }
	    tbody.append('<tr><td colspan="6"><a class="btn" onclick="removeMembers(\''+uuid+'\');"><i class="icon-trash"></i> Remove selected</a></td></tr>');
	    table.append(tbody);
	    $(live).append(table);
	  }			      
	 	else
	 	{
			$(live).append('<p>There are no members.</p>');
	 	}
	 	
	 	$('#content').html(live);
	}
	
	
	function renderSearch(data)
	{
		var data = data ? JSON.parse(data) : undefined;
		
		$('#groupsList li').removeClass('active');
	 	
		var live = $('<div id="live"></div>');
		live.addClass('search');
	  
	  var title = $('<h2><span class="entypo eMedium">,</span> Search Results</h2><br>Search query: "<span id="searchQuery">{Search Query}</span>". Total found results: <span id="searchResultsTotal">{Search Results Total}</span><br>');
	  
	  $(live).append(title);  
		
		if (data && data.length > 0)
		{		
			var table = $('<table id="tb-searchResultsTable" class="table table-striped"></table>');
			var thead = $('<thead><tr></tr></thead>');
			thead.append('<th><input type="checkbox" onclick="toggleChecked(\'searchResultsTable\', this.checked)" /></th>');
			thead.append('<th>Name</th>');
			table.append(thead);
			var tbody = $('<tbody></tbody>');
	    for(var n in data)
	    {
	    	var tbodytr = $('<tr></tr>');
				tbodytr.append('<td><input type="checkbox" class="checkbox" value="'+data[n].id+'" /></td>');
				tbodytr.append('<td>'+data[n].name+'</td>');
				tbody.append(tbodytr);
	    }
	    tbody.append('<tr><td><form class="form-inline"><div class="control-group"><div class="controls docs-input-sizes"><select id="groupsAddList"></select> <a onclick="addMembers();" class="btn"><i class="icon-plus"></i> Add to group</a></div></div></form></td></tr>');
	    table.append(tbody);
	    $(live).append(table);
		}
		else
		{
			$(live).append('<p>There are no results.</p>');
		}
	 	$('#content').html(live);
		$('#searchQuery').html($('#q').val());
		$('#searchResultsTotal').html(data.length);	
	}
	
	
	function renderAddGroupsList(groups)
	{
	  for(var i in groups)
	  {		    
	  	$('#groupsAddList').append('<option value="'+groups[i].uuid+'">'+groups[i].name+'</option>');
	  }
	}
	
})();



