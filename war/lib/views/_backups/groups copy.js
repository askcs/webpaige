$(document).ready(function()
{
 	pageInit('groups', 'true');
 	
 	loadGroups();
 	
 	$("#searchMemberBtn").click(function()
 	{
 		var value = $('#q').val();
 		searchMembers(value);
 	});
 	
 	$("#searchResults").hide();
 	
  $("#alertDiv").hide();
 	
 	$('#groupsList').click(function()
 	{
 		$("#members").show();
 		$("#searchResults").hide();
  	$("#alertDiv").hide();
  	$('#q').val("");
 	});

  $('#groupSubmitter').click(function()
  {
    $('#newGroup').modal('hide');
    var newGroupName = $('#newGroupName').val();
    addNewGroup(newGroupName);
    $('#newGroupForm')[0].reset();
  });

  $('#editGroupSubmitter').click(function()
  {
    $('#editGroup').modal('hide');
    var editGroupName = $('#editGroupName').val();
    var uuid = $('#editGroupUUID').val();
		updateGroup(editGroupName, uuid);
    $('#editGroupForm')[0].reset();
  });

  $('#deleteGroupBtn').click(function()
  {
    $('#editGroup').modal('hide');
    var editGroupUUID = $('#editGroupUUID').val();
    deleteGroup(editGroupUUID);
    $('#editGroupForm')[0].reset();
    console.log("group uuid:", editGroupUUID);
  });
  
});

var session = new ask.session();
session.getSession();

function searchMembers(value)
{
	var json = '{"key":"' + value + '"}';
  $.ajax(
  {
    url: host + '/network/searchPaigeUser',
    type: 'POST',
    data: json,
    contentType: 'application/json',
    xhrFields: { withCredentials: true },
    success: function(data) {
      renderSearchResults(data);
    }
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
  
		$('#searchResultsPane').append('<div id="searchResultsPaneContent"><h2><span class="entypo eMedium">,</span> Search Results</h2><hr></div>');
		
		var table = $('<table id="tb-searchResultsTable" class="table table-striped"></table>');
		table.append('<thead><tr><th><input type="checkbox" onclick="toggleChecked(\'searchResultsTable\', this.checked)" /></th><th>Name</th></tr></thead>');
		var body = $('<tbody></tbody>');
		
    for(var n in data)
    {
			body.append('<tr><td><input type="checkbox" class="checkbox" value="'+data[n].id+'" /></td><td>'+data[n].name+'</td></tr>');
    }
    
    table.append(body);
  
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

function addNewGroup(groupName)
{
  var user = JSON.parse(localStorage.getItem('user')); 		
  var uuid = user.uuid;
	
	console.log("uuid:", uuid);
	console.log("groupName:" + groupName);
	
  var json = '{"name": "' + groupName + '"}';
  $.ajax(
  {
    url: host + '/network/' + uuid,
    type: 'POST',
    data: json,
    contentType: 'application/json',
    xhrFields: { withCredentials: true },
    success: function(data) {
      window.location.reload();
    }
  });	
}

function updateGroup(groupName, uuid)
{
  var user = JSON.parse(localStorage.getItem('user'));
	
	console.log("uuid:", uuid);
	console.log("groupName:" + groupName);
	
  var json = '{"name": "' + groupName + '"}';
  $.ajax(
  {
    url: host + '/network/' + uuid,
    type: 'PUT',
    data: json,
    contentType: 'application/json',
    xhrFields: { withCredentials: true },
    success: function(data) {
      window.location.reload();
    }
  });	
}

function editGroupInit(groupName, uuid)
{
  $('#editGroup').modal('show');
  var editGroupName = $('#editGroupName').val(groupName);	
  var editGroupUUID = $('#editGroupUUID').val(uuid);			
}

function deleteGroup(uuid)
{
	console.log("delete this group: ", uuid);
	
  //var json = '{"name": "' + groupName + '"}';
  $.ajax(
  {
    url: host + '/network/' + uuid,
    type: 'DELETE',
    //data: json,
    contentType: 'application/json',
    xhrFields: { withCredentials: true },
    success: function(data) {
      //window.location.reload();
    }
  });	
}

function addMembers()
{
	var guuid = $('#groupsAddList option:selected').val();
	console.log(guuid);
  var values = $('#searchResultsPane input:checkbox:checked').map(function ()
  {
	  console.log("member :", this.value);
	  if (this.value != 'on')
	  {
		  $.ajax(
		  {
		  	// check here for unescape !!
		  	url: host + '/network/' + unescape(guuid) + '/members/' + this.value,
		    type: 'POST',
		    beforeSend: function(xhr) {
		      xhr.setRequestHeader('X-SESSION_ID', session.getSession());
		      return true;
		    },
		    contentType: 'application/json',
		    xhrFields: { withCredentials: true },
		    success: function(jsonData) {
		    	console.log("members added to group");
		    },
		    error: function() {}
		  });
	  }
	}).get();
}

function renderAddGroupsList(groups)
{
  for(var i in groups)
  {		    
  	$('#groupsAddList').append('<option value="'+groups[i].uuid+'">'+groups[i].name+'</option>');
  }
}

function loadGroups()
{
	groups = new bend();
	groups.getData('/network', true, renderGroups);
}

function renderGroups(data)
{
  $('#groupsList').append('<li class="nav-header">Groups</li>');
  for(var i in data)
  {
  	if (i == 0)
  	{
  		$('#groupsList').append('<li class="active"><a data-toggle="tab" href="#tc-'+i+'">'+data[i].name+'</a></li>');
  		$('#members .tab-content').append('<div id="tc-'+i+'" class="tab-pane active"></div>');
  	}
  	else
  	{
  		$('#groupsList').append('<li><a data-toggle="tab" href="#tc-'+i+'">'+data[i].name+'</a></li>');
  		$('#members .tab-content').append('<div id="tc-'+i+'" class="tab-pane"></div>');
  	}
  	loadMembers(data[i].name, data[i].uuid, i);
  }
}

function loadMembers(groupName, uuid, i)
{
	members = new bend();
	members.getData('/network/' + uuid + '/members', true, renderMembers);
	
	/*
  $.ajax(
  {
    url: host + '/network/' + uuid + '/members',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-SESSION_ID', session.getSession());
      return true;
    },
    contentType: 'application/json',
    xhrFields: { withCredentials: true },
    success: function(jsonData) {
    	renderMembers(groupName, uuid, jsonData, i); 
    },
    error: function() {}
  });
	*/
}

function renderMembers(data)
{
	console.log(data);
}

function renderMembersa(data, groupName, uuid, i)
{	
 	data = JSON.parse(data);
		
	var tabContent = '#tc-'+i;
  
  var groupTitle = $('<div class="btn-group btn-hanging"><a onClick="editGroupInit(\''+groupName+'\', \''+uuid+'\')" class="btn"><i class="icon-edit"></i> Edit group</a><a onClick="deleteGroup(\''+uuid+'\')" class="btn"><i class="icon-remove"></i> Delete group</a></div><h2><span class="entypo eMedium">,</span> Members: '+groupName+'</h2><hr>');
  $(tabContent).append(groupTitle);
    
 	if (data.length > 0)
 	{
		var table = $('<table id="tb-'+uuid+'" class="table table-striped"></table>');
		table.append('<thead><tr><th><input type="checkbox" onclick="toggleChecked(\''+uuid+'\', this.checked)" /></th><th>Name</th><th>Email</th><th>Phone</th><th></th></tr></thead>');
		var body = $('<tbody></tbody>');
    for(var n in data)
    {
			body.append('<tr><td><input type="checkbox" class="checkbox" value="'+data[n].uuid+'" /></td><td>'+data[n].name+'</td><td>'+data[n].resources.EmailAddress+'</td><td>'+data[n].resources.PhoneAddress+'</td><td><a class="btn btn-mini" onclick="removeMember(\''+uuid+'\', \''+data[n].uuid+'\');"><i class="icon-trash"></i></a></td></tr>');
    }
    body.append('<tr><td colspan="6"><a class="btn" onclick="removeMembers(\''+uuid+'\');"><i class="icon-trash"></i> Remove selected</a></td></tr>');
    table.append(body);
    
    $(tabContent).append(table);
  }			      
 	else
 	{
 		// check here !!
		$('#tc-'+i).append('<p>There are no users</p>');
 	}
}

function removeMembers(uuid)
{
	console.log(uuid);
	
	var specificTable = '#tb-' + uuid + ' input:checkbox:checked';
	
	console.log(specificTable);
	
  var values = $(specificTable).map(function ()
  {
	  if (this.value != 'on')
	  {
	  	console.log("member :", this.value);
	  	removeMember(uuid, this.value);
	  }
	}).get();
}	
 	
function removeMember(uuid, muuid)
{	 			
	$.ajax(
	{
		url: host + '/network/' + uuid + '/members/' + muuid,
	  type: 'DELETE',
	  beforeSend: function(xhr) {
	    xhr.setRequestHeader('X-SESSION_ID', session.getSession());
	    return true;
	  },
	  contentType: 'application/json',
	  xhrFields: { withCredentials: true },
	  success: function(jsonData) {
	  	//console.log(req);
	  	//$("#members").remove();
	  	//loadGroups();
	  },
	  error: function() {}
	});
}
	
function toggleChecked(uuid, status)
{
	var ids = "#tb-" + uuid.replace(/([@.:#])/g, '\\$1') + " input"; 
	//console.log("uuid id:", ids);
	$(ids).each( function()
	{
		$(this).attr("checked",status);
	})
}
