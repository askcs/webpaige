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
  
});


var session = new ask.session();


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
			//local.set(label, data);
    	console.log(data, uuid, name);
    	renderGroups(data, uuid, name);
		}
	);
	
	
	/*
	webpaige.con('get', '/network', null, 'Loading groups..', null,
	function(data)
  {
    renderGroups(data, uuid, name);
	});
	*/
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
  var json = '{"name": "' + name + '"}';
	webpaige.con('put', '/network/'+uuid, json, 'Updating group', 'Group updated.',
	function(data)
  {
    loadGroups(uuid, name);
	});
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
	
	/*
	webpaige.con('delete', '/network/'+uuid, null, 'Deleting group..', 'Group deleted',
	function(data)
  {
	  loadGroups();
	});
	*/
}


function searchMembers(value)
{
	/*
  var json = '{"key":"' + value + '"}';
	webpaige.con('post', '/network/searchPaigeUser', json, 'Searching members..', null,
	function(data)
  {
		renderSearch(data);
  	renderAddGroupsList(window.groups);
	});
	*/
	
	
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
	  	console.log(data, name, uuid);
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
	
			/*
			webpaige.con('post', '/network/'+uuid+'/members/'+this.value, null, 'Adding member(s)..', 'Member(s) added',
			function(data)
		  {
		  	loadGroups();
		  });
			*/
		  
	  }
	}).get();
}


function addNewMemberToGroup(name, uuid)
{
	$('#newMember').modal('show');
	$('#newMember h3').html('New member (' + name + ')');
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
	webpaige.con('delete', '/network/'+uuid+'/members/'+memberUuid, null, 'Removing member(s)..', 'Member(s) removed',
	function(data)
  {
  	loadGroups(uuid, name);
	});
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
			tbodytr.append('<td>'+data[n].name+'</td>');
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