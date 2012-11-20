
$(document).ready(function()
{
 	pageInit('groups', 'true');
 	
 	loadGroups();
 	
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
	 	
	$(".chzn-select").chosen();
	$(".chzn-select-deselect").chosen(
	{
		allow_single_deselect:true
	});


	var local = {
		title: 'groups_title',
		statics: ['groups_search_members', 'groups_search', 'groups_new_member', 'groups_role', 'groups_groups', 'groups_username', 'groups_first_name', 'groups_last_name', 'groups_phone_number', 'groups_email_address', 'groups_password', 'groups_cancel', 'groups_save_member', 'groups_edit_member', 'groups_firstlast_name', 'groups_address', 'groups_postcode', 'groups_city', 'groups_new_group', 'groups_group_name', 'groups_save_group', 'groups_edit_group', 'groups_delete_group']		
	}
	webpaige.i18n(local);
  
});


var session = new ask.session();


function loadGroups(uuid, name)
{
	webpaige.con(
		options = {
			path: '/network',
			loading: 'De groepen worden opgeladen..',
			label: 'groups'
			,session: session.getSession()	
		},
		function(data, label)
	  {  
    	renderGroups(data, uuid, name);
    	renderGroupsList(data);
		}
	);
}


function addGroup()
{
  $('#newGroup').modal('hide');
  var name = $('#newGroupName').val(); 
  
  webpaige.config('addedGroup', name);
   
  $('#newGroupForm')[0].reset();
  var resources = JSON.parse(localStorage.getItem('resources')); 	
  var body = '{"name": "' + name + '"}';	
	webpaige.con(
		options = {
			type: 'post',
			path: '/network/'+resources.uuid,
			loading: 'Nieuwe groep wordt toegevoegd..',
			json: body,
			message: 'Groep is toegevoegd.',
			label: 'addGroup'
			,session: session.getSession()	
		},
		function(data)
	  {
    	loadGroups(data, webpaige.config('addedGroup'));
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
			loading: 'Groep wordt gewijzigd..',
			json: body,
			message: 'Groep gewijzigd.',
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
			loading: 'Groep wordt verwijderd..',
			message: 'Groep is verwijderd.',
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
			loading: 'Zoeken naar contacten in uw netwerk..',
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
			path: '/network/'+uuid+'/members?fields=[role]',
			loading: 'Contacten worden opgeladen..',
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
					loading: 'Nieuwe contact(en) toegevoegd..',
					label: 'Contact(en) is toegevoegd.'
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


function addNewMember()
{
	$('#groupsListNew .chzn-select').html('');
	
	renderGroupsList(window.groups);
}


function addNewMemberToGroup(name, uuid)
{
	$('#groupsListNew .chzn-select').html('');
	
	renderGroupsList(window.groups);
	
	$('#newMember').modal('show');
	
  $('#groupsListNew .chzn-select').append(
    $('<option></option>')
		        .val(uuid)
		        .html(name)
		        .attr("selected", "selected"));
	$("#groupsListNew .chzn-select").trigger("liszt:updated");
}


function saveNewMember()
{
	$('#newMember').modal('hide');
	var role = $('#newMember #roles').val();
	var fname = $('#newMember #fname').val();
	var lname = $('#newMember #lname').val();
	var name = fname + ' ' + lname;
	var tel = $('#newMember #tel').val();
	var uuid = $('#newMember #email').val();
	var pass = $('#newMember #pass').val();
	var guuids = $('#groupsListNew select').val();

	webpaige.con(
		options = {
			path: '/register?uuid=' + uuid + '&pass=' + MD5(pass) + '&name=' + name + '&phone=' + tel + '&direct=true&module=default',
			loading: 'Registering new user..',
			label: 'New member'
			,session: session.getSession()	
		},
		function(data, label)
	  {
		  var tags = '{' +
		  	'"role":"' + role + '"' +
		  	'}';
		
			webpaige.con(
				options = {
					type: 'put',
					path: '/node/'+uuid+'/resource',
					json: tags,
					loading: 'Contact informatie wordt opgeslagen..',
					message: 'Contact informatie is opgeslagen.',
					label: 'member'
					,session: session.getSession()	
				},
				function(data, label)
			  { 
					console.log('member role usccesfully added, ', role);
				}
			);
			
	  	for (var h in guuids)
	  	{
		    // add user to the group
				webpaige.con(
					options = {
						type: 'post',
						path: '/network/'+guuids[h]+'/members/'+uuid,
						loading: 'Contact wordt toegevoegd in groep..',
						label: 'Contact is toegevoegd in groep.'
						,session: session.getSession()	
					},
					function(data, label)
				  {  
			  		loadGroups();
					}
				); // end of add user to groups 
	  	} // end of adding to group loop
		}
	); 
	// end of register in ask
}


function editMemberModalInit(guuid, uuid)
{
	
	$('#groupsListEdit .chzn-select').html('');
	
	
	webpaige.con(
		options = {
			path: '/node/'+uuid+'/resource',
			loading: 'Contact informatie wordt opgehaald..',
			message: 'Contact informatie is opgeladen.',
			label: 'resource'
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	  
			$('form#editMemberForm')[0].reset();
	  
	  	var roles = [
	  		{
		  		name: 'Vrijwillliger',
		  		value: 3
	  		},
	  		{
		  		name: 'Teamleider',
		  		value: 2
	  		},
	  		{
		  		name: 'Planner',
		  		value: 1
	  		}
	  	];
	  	
	  	for (var i in roles)
	  	{
		  	if (data.role == roles[i].value)
		  	{
			  	$('#editMember #roles').val(data.role).attr('selected',true);
		  	}
	  	}
  		$('#editMember').modal('show');
  		$('#editMember #username').val(data.uuid);	
  		$('#editMember #name').val(data.name);	
  		$('#editMember #tel').val(data.PhoneAddress);	
  		$('#editMember #email').val(data.EmailAddress);	
  		$('#editMember #address').val(data.PostAddress);	
  		$('#editMember #postcode').val(data.PostZip);	
  		$('#editMember #city').val(data.PostCity);	
  		$('#editMember #country').val(data.PostCountry);	
  		$('#editMember #uuid').val(data.uuid);	
  		$('#editMember #guuid').val(guuid);	
  		
			webpaige.con(
				options = {
					path: '/parent?uuid='+data.uuid,
					loading: 'Parent groep informatie wordt opgeladen..',
					label: 'parent group: '
					,session: session.getSession()	
				},
				function(data, label)
			  {
			  	renderGroupsListUser(window.groups);
			  	
			  	for (var i in data)
			  	{
				  	$('#groupsListEdit .chzn-select option[value="'+data[i].uuid+'"]').attr('selected', true);
			  	}
			  	
					$("#groupsListEdit .chzn-select").trigger("liszt:updated");
			
				}
			); 
			
			
		}
	);	
}



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
	  	
	  	var counter = data.length;
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
	
	var role = $('#editMember #roles').val();
	var name = $('#editMember #name').val();	
	var tel = $('#editMember #tel').val();	
	var email = $('#editMember #email').val();
	var address = $('#editMember #address').val();
	var postcode = $('#editMember #postcode').val();
	var city = $('#editMember #city').val();
	var guuid = $('#editMember #guuid').val();
  	
  var tags = '{' +
  	'"name":"' + name + '", ' +
  	'"PhoneAddress":"' + tel + '", ' +
  	'"EmailAddress":"' + email + '", ' +
  	'"PostAddress":"' + address + '", ' +
  	'"PostZip":"' + postcode + '", ' +
  	'"PostCity":"' + city + '"' +
  	'}';
					
		
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
		
			webpaige.con(
				options = {
					type: 'put',
					path: '/node/'+uuid+'/role',
					json: role,
					loading: 'Contact role wordt opgeslagen..',
					message: 'Contact role is gewijzigd.',
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
			  			loadGroups(guuid, data.name); 
					  }
					);
				}
			);
			
		}
	);
	
	
	
}



function removeMembers(name, uuid)
{
	var specificTable = '#tb-' + uuid + ' input:checkbox:checked';
  var values = $(specificTable).map(function ()
  {
	  if (this.value != 'on')
	  {
	  	removeMember(name, uuid, this.value);
	  }
	}).get();
}	


function removeMember(name, uuid, memberUuid)
{
	webpaige.con(
		options = {
			type: 'delete',
			path: '/network/'+uuid+'/members/'+memberUuid,
			loading: 'Contact wordt verwijderd..',
			label: 'Contact is verwijderd.'
			,session: session.getSession()	
		},
		function(data, label)
	  { 
	  	//debugger; 
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
  $(groupsList).append('<li class="nav-header">Groepen</li>');
   
  for (var i in data)
  {
  	if (uuid == null && name == null && i==0)
  	{
  		$(groupsList).append('<li class="active"><a onClick="loadGroups(\''+data[i].uuid+'\', \''+data[i].name+'\')">'+data[i].name+'</a></li>');
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
  		$(groupsList).append('<li'+active+'><a onClick="loadGroups(\''+data[i].uuid+'\', \''+data[i].name+'\')">'+data[i].name+'</a></li>');
			var uuid = uuid;
			var name = name;	
  	}
  }
  
  $('#groupsNav').html(groupsList);
  loadMembers(name, uuid);
}



function renderMembers(json, name, uuid)
{
 	var data = json;
 	
 	$('#live').remove();
 	
	var live = $('<div id="live"></div>');
	
  var btnGroup = $('<div class="btn-group btn-hanging"></div>');
  
  //$(btnGroup).append('<a onClick="addNewMemberToGroup(\''+name+'\', \''+uuid+'\')" class="btn"><i class="icon-user"></i> Add new member</a>');
  
  $(btnGroup).append('<a data-toggle="modal" href="#newGroup" class="btn"><i class="icon-plus"></i> Nieuwe groep</a>');
  
  $(btnGroup).append('<a onClick="editGroupModalInit(\''+name+'\', \''+uuid+'\')" class="btn"><i class="icon-edit"></i> Bewerk groep</a>');
  
  $(btnGroup).append('<a onClick="deleteGroup(\''+uuid+'\')" class="btn"><i class="icon-remove"></i> Verwijder groep</a>');
  
  $(live).append(btnGroup);
  
  $(live).append('<div class="btn-group btn-hanging"><a data-toggle="modal" href="#newMember" onclick="addNewMember()" class="btn"><i class="icon-user"></i> Nieuwe contact</a></div>');
  
  var title = $('<h2><span class="entypo eMedium">,</span> '+name+'</h2><br>');  
  
  $(live).append(title);
  
 	if (data && data.length > 0)
 	//if (data)
 	{
		var table = $('<table id="tb-'+uuid+'" class="table table-striped"></table>');
		var thead = $('<thead><tr></tr></thead>');
		thead.append('<th><input type="checkbox" onclick="toggleChecked(\''+uuid+'\', this.checked)" /></th>');
		thead.append('<th>Naam</th>');
		
		thead.append('<th>Role</th>');
		
		thead.append('<th>Telefoonnummer</th>');
		thead.append('<th></th>');
		table.append(thead);
		var tbody = $('<tbody></tbody>');
    for(var n in data)
    {
    	var tbodytr = $('<tr></tr>');
			tbodytr.append('<td><input type="checkbox" class="checkbox" value="'+data[n].uuid+'" /></td>');
			
			tbodytr.append('<td><a onclick="editMemberModalInit(\''+uuid+'\', \''+data[n].uuid+'\');">'+data[n].name+'</a></td>');
			
	  	var roles = [
	  		{
		  		name: 'Vrijwillliger',
		  		value: 3
	  		},
	  		{
		  		name: 'Teamleider',
		  		value: 2
	  		},
	  		{
		  		name: 'Planner',
		  		value: 1
	  		}
	  	];
	  	
	  	for (var i in roles)
	  	{
		  	if (data[n].resources.role == roles[i].value)
		  	{
			  	var role = roles[i].name;
		  	}
	  	}
			tbodytr.append('<td>'+ role +'</td>');
			
			tbodytr.append('<td>'+data[n].resources.PhoneAddress+'</td>');
			tbodytr.append('<td><a class="btn btn-mini" onclick="removeMember(\''+name+'\', \''+uuid+'\', \''+data[n].uuid+'\');"><i class="icon-trash"></i> Verwijder</a></td>');
			tbody.append(tbodytr);
    }
    tbody.append('<tr><td colspan="6"><a class="btn" onclick="removeMembers(\''+name+'\', \''+uuid+'\');"><i class="icon-trash"></i> Verwijder geselecteerde contacten</a></td></tr>');
    table.append(tbody);
    $(live).append(table);
  }			      
 	else
 	{
		$(live).append('<p>Er zijn geen contacten.</p>');
 	}
 	
 	$('#content').html(live);
}


function renderSearch(data)
{
	
	$('#groupsList li').removeClass('active');
 	
	var live = $('<div id="live"></div>');
	live.addClass('search');
  
  var title = $('<h2><span class="entypo eMedium">,</span> Zoek resultaten</h2><br>Trefwoorden: "<span id="searchQuery">{Search Query}</span>". Gevonden resultaten: <span id="searchResultsTotal">{Search Results Total}</span><br>');
  
  $(live).append(title);  
	
	if (data && data.length > 0)
	{		
		var table = $('<table id="tb-searchResultsTable" class="table table-striped"></table>');
		var thead = $('<thead><tr></tr></thead>');
		thead.append('<th><input type="checkbox" onclick="toggleChecked(\'searchResultsTable\', this.checked)" /></th>');
		thead.append('<th>Naam</th>');
		table.append(thead);
		var tbody = $('<tbody></tbody>');
    for(var n in data)
    {
    	var tbodytr = $('<tr></tr>');
			tbodytr.append('<td><input type="checkbox" class="checkbox" value="'+data[n].id+'" /></td>');
			tbodytr.append('<td width="96%">'+data[n].name+'</td>');
			tbody.append(tbodytr);
    }
    tbody.append('<tr><td><form class="form-inline"><div class="control-group"><div class="controls docs-input-sizes"><select id="groupsAddList"></select> <a onclick="addMembers();" class="btn"><i class="icon-plus"></i> Toevoegen aan de groep</a></div></div></form></td></tr>');
    table.append(tbody);
    $(live).append(table);
	}
	else
	{
		$(live).append('<p>Er zijn geen resultaten.</p>');
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



function renderGroupsList(groups)
{
  for(var n in groups)
  {		
  	$('#groupsListNew .chzn-select').append("<option value=" + groups[n].uuid + ">" + groups[n].name + "</option>");
  }
	$("#groupsListNew .chzn-select").trigger("liszt:updated");
}




function renderGroupsListUser(groups)
{
  for(var n in groups)
  {	
  	$('#groupsListEdit .chzn-select').append("<option value=" + groups[n].uuid + ">" + groups[n].name + "</option>");
  }
}





