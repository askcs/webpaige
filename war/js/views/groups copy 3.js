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

  $('#groupSubmitter').click(function()
  {
    $('#newGroup').modal('hide');
    var newGroupName = $('#newGroupName').val();
    $('#newGroupForm')[0].reset();
    addGroup(newGroupName);
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


function loadGroups()
{
	webpaige.con('get', '/network', null, 'Loading groups..', null,
	function(data)
  {
    renderGroups(data);
	});
}


function renderGroups(data)
{
	window.groups = data;
	$('#groupsList').remove();
	var groupsList = $('<ul id="groupsList" class="nav nav-list"></ul>');
  $(groupsList).append('<li class="nav-header">Groups</li>');
  for(var i in data)
  {
  	if (i == 0)
  	{
  		$(groupsList).append('<li class="active"><a data-toggle="tab" href="#tc-'+i+'">'+data[i].name+'</a></li>');
  		$('#members .tab-content').append('<div id="tc-'+i+'" class="tab-pane active"></div>');
  	}
  	else
  	{
  		$(groupsList).append('<li><a data-toggle="tab" href="#tc-'+i+'">'+data[i].name+'</a></li>');
  		$('#members .tab-content').append('<div id="tc-'+i+'" class="tab-pane"></div>');
  	}
  	$('#groupsNav').html(groupsList);
  	loadMembers(data[i].name, data[i].uuid, i);
  }
}


function addGroup(groupName)
{
  var user = JSON.parse(localStorage.getItem('user')); 		
  var uuid = user.uuid;
  var json = '{"name": "' + groupName + '"}';
	webpaige.con('post', '/network/'+uuid, json, 'Adding new group..', 'Group added.',
	function(data)
  {
    loadGroups();
	});
}


function updateGroup(groupName, uuid)
{
  var json = '{"name": "' + groupName + '"}';
	webpaige.con('put', '/network/'+uuid, json, 'Updating group', 'Group updated.',
	function(data)
  {
    loadGroups();
	});
}


function editGroupModalInit(groupName, uuid)
{
  $('#editGroup').modal('show');
  var editGroupName = $('#editGroupName').val(groupName);	
  var editGroupUUID = $('#editGroupUUID').val(uuid);			
}


function deleteGroup(uuid)
{
	webpaige.con('delete', '/network/'+uuid, null, 'Deleting group..', 'Group deleted',
	function(data)
  {
	  loadGroups();
	});
}


function searchMembers(value)
{
  var json = '{"key":"' + value + '"}';
	webpaige.con('post', '/network/searchPaigeUser', json, 'Searching members..', null,
	function(data)
  {
		renderSearchResults();
	});
}


function renderSearchResults(data)
{
	var data = JSON.parse(data);
	$('#groupsList li').removeClass('active');
	if (data.length > 0)
	{
		$('#searchResultsPane').remove();
		$('#searchResults .tab-content').append('<div id="searchResultsPane" class="tab-pane active"></div>');
		$('#searchResultsPane').append('<div id="searchResultsPaneContent"></div>');
		$('#searchResultsPaneContent').append('<h2><span class="entypo eMedium">,</span> Search Results</h2>');
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
    table.append(tbody);
    $("#members").hide();
    $("#searchResults").show();
    $("#searchResultsPaneContent").html(table);
    renderAddGroupsList(window.groups);
	}
	else
	{
		$('#searchResultsPane').remove();
		$('#searchResults .tab-content').append('<div id="searchResultsPane" class="tab-pane active"></div>');
		$('#searchResultsPane').append('<div id="searchResultsPaneContent"></div>');
    $("#members").hide();
    $("#searchResults").show();
	}
  $("#alertDiv").show();
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


function loadMembers(groupName, uuid, i)
{
	webpaige.con('get', '/network/'+uuid+'/members', null, 'Loading members..', null,
	function(data)
  {
	  renderMembers(data, groupName, uuid, i);
	});
}


function renderMembers(data, groupName, uuid, i)
{
 	data = JSON.parse(data);
 	$('#tc-'+i).remove();
	var tabContent = '#tc-'+i;
	
	if (i == 0)
	{
		var active = ' active';
	}
	else
	{
		var active = '';
	}
	$('#members .tab-content').append('<div id="tc-'+i+'" class="tab-pane' + active + '"></div>');
	
  var btnGroup = $('<div class="btn-group btn-hanging"></div>');
  $(btnGroup).append('<a onClick="editGroupModalInit(\''+groupName+'\', \''+uuid+'\')" class="btn"><i class="icon-edit"></i> Edit group</a>');
  $(btnGroup).append('<a onClick="deleteGroup(\''+uuid+'\')" class="btn"><i class="icon-remove"></i> Delete group</a>');
  $(tabContent).append(btnGroup);
  var title = $('<h2><span class="entypo eMedium">,</span> Members: '+groupName+'</h2>');  
  $(tabContent).append(title);
 	if (data.length > 0)
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
    $(tabContent).append(table);
  }			      
 	else
 	{
		$('#tc-'+i).append('<p>There are no users</p>');
 	}
}


function addMembers()
{
	var groupUuid = $('#groupsAddList option:selected').val();
  var values = $('#searchResultsPane input:checkbox:checked').map(function ()
  {
	  if (this.value != 'on')
	  {
			webpaige.con('post', '/network/'+groupUuid+'/members/'+this.value, null, 'Adding member(s)..', 'Member(s) added',
			function(data)
		  {
		  	loadGroups();
		  });
	  }
	}).get();
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
  	loadGroups();
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