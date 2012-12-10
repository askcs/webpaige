'use strict';
/* Groups controller */

var groups = function($scope)
{
  this.loadGroups();
  $("#searchResults").hide();
  $("#alertDiv").hide();
  $('#groupsList').click(function ()
  {
    $("#members").show();
    $("#searchResults").hide();
    $("#alertDiv").hide();
    $('#q').val("");
  });
  $("#searchMemberBtn").click(function ()
  {
    var value = $('#q').val();
    this.searchMembers(value);
  });
  $('#groupSubmit').click(function ()
  {
    this.addGroup();
  });
  $('#saveNewMember').click(function ()
  {
    this.saveNewMember();
  });
  $('#editMemberBtn').click(function ()
  {
    this.editMember();
  });
  $('#editGroupSubmitter').click(function ()
  {
    $('#editGroup').modal('hide');
    var editGroupName = $('#editGroupName').val();
    var uuid = $('#editGroupUUID').val();
    $('#editGroupForm')[0].reset();
    this.updateGroup(editGroupName, uuid);
  });
  $('#deleteGroupBtn').click(function ()
  {
    $('#editGroup').modal('hide');
    var editGroupUUID = $('#editGroupUUID').val();
    $('#editGroupForm')[0].reset();
    this.deleteGroup(editGroupUUID);
  });
  $(".chzn-select").chosen();
  $(".chzn-select-deselect").chosen(
  {
    allow_single_deselect: true
  });
}

groups.prototype = $.extend({}, app.prototype, {

	constructor: groups,
	
	loadGroups: function(uuid, name)
	{
	  webpaige.con(
	  {
	    path: '/network',
	    loading: 'De groepen worden opgeladen..',
	    label: 'groups',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	    this.renderGroups(data, uuid, name);
	    this.renderGroupsList(data);
	  });
	},

/*
	addGroup: function()
	{
	  $('#newGroup').modal('hide');
	  var name = $('#newGroupName').val();
	  webpaige.config('addedGroup', name);
	  $('#newGroupForm')[0].reset();
	  var resources = JSON.parse(localStorage.getItem('resources'));
	  var body = '{"name": "' + name + '"}';
	  webpaige.con(
	  {
	    type: 'post',
	    path: '/network/' + resources.uuid,
	    loading: 'Nieuwe groep wordt toegevoegd..',
	    json: body,
	    message: 'Groep is toegevoegd.',
	    label: 'addGroup',
	    session: session.getSession()
	  },
	  function (data)
	  {
	    this.loadGroups(data, webpaige.config('addedGroup'));
	  });
	},
*/

/*
	updateGroup: function(name, uuid)
	{
	  var body = '{"name": "' + name + '"}';
	  webpaige.con(
	  {
	    type: 'put',
	    path: '/network/' + uuid,
	    loading: 'Groep wordt gewijzigd..',
	    json: body,
	    message: 'Groep gewijzigd.',
	    label: 'groups',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	    this.loadGroups(uuid, name);
	  });
	},
*/

/*
	editGroupModalInit: function(name, uuid)
	{
	  $('#editGroup').modal('show');
	  var editGroupName = $('#editGroupName').val(name);
	  var editGroupUUID = $('#editGroupUUID').val(uuid);
	},
*/

/*
	deleteGroup: function(uuid)
	{
	  webpaige.con(
	  {
	    type: 'delete',
	    path: '/network/' + uuid,
	    loading: 'Groep wordt verwijderd..',
	    message: 'Groep is verwijderd.',
	    label: 'groups',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	    this.loadGroups();
	  });
	},
*/

/*
	searchMembers: function(value)
	{
	  var body = '{"key":"' + value + '"}';
	  webpaige.con(
	  {
	    type: 'post',
	    path: '/network/searchPaigeUser',
	    json: body,
	    loading: 'Zoeken naar contacten in uw netwerk..',
	    label: 'searched',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	    this.renderSearch(data);
	    this.renderAddGroupsList(window.groups);
	  });
	},
*/

	loadMembers: function(name, uuid)
	{
	  webpaige.con(
	  {
	    path: '/network/' + uuid + '/members?fields=[role]',
	    loading: 'Contacten worden opgeladen..',
	    label: 'members',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	    $('#live').remove();
	    this.renderMembers(data, name, uuid);
	  });
	},

/*
	addMembers: function()
	{
	  var uuid = $('#groupsAddList option:selected').val();
	  var values = $('.search input:checkbox:checked').map(function ()
	  {
	    if (this.value != 'on')
	    {
	      webpaige.con(
	      {
	        type: 'post',
	        path: '/network/' + uuid + '/members/' + this.value,
	        loading: 'Nieuwe contact(en) toegevoegd..',
	        label: 'Contact(en) is toegevoegd.',
	        session: session.getSession()
	      },
	      function (data, label)
	      {
	        this.loadGroups(uuid);
	      });
	    }
	  }).get();
	},
*/

/*
	addNewMember: function()
	{
	  $('#groupsListNew .chzn-select').html('');
	  this.renderGroupsList(window.groups);
	},
*/

/*
	addNewMemberToGroup: function(name, uuid)
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
	},
*/

/*
	saveNewMember: function()
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
	  {
	    path: '/register?uuid=' + uuid + '&pass=' + MD5(pass) + '&name=' + name + '&phone=' + tel + '&direct=true&module=default',
	    loading: 'Registering new user..',
	    label: 'New member',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	    var tags = '{' + '"role":"' + role + '"' + '}';
	    webpaige.con(
	    {
	      type: 'put',
	      //path: '/node/' + uuid + '/resource',
	      path: '/node/' + uuid + '/role',
	      //json: tags,
	      json: role,
	      loading: 'Contact informatie wordt opgeslagen..',
	      message: 'Contact informatie is opgeslagen.',
	      label: 'member',
	      session: session.getSession()
	    },
	    function (data, label)
	    {
	      console.log('member role usccesfully added, ', role);
	    });
	    for (var h in guuids)
	    {
	      // add user to the group
	      webpaige.con(
	      {
	        type: 'post',
	        path: '/network/' + guuids[h] + '/members/' + uuid,
	        loading: 'Contact wordt toegevoegd in groep..',
	        label: 'Contact is toegevoegd in groep.',
	        session: session.getSession()
	      },
	      function (data, label)
	      {
	        this.loadGroups();
	      }); // end of add user to groups 
	    } // end of adding to group loop
	  });
	  // end of register in ask
	},
*/

/*
	editMemberModalInit: function(guuid, uuid)
	{
	  $('#groupsListEdit .chzn-select').html('');
	  webpaige.con(
	  {
	    path: '/node/' + uuid + '/resource',
	    loading: 'Contact informatie wordt opgehaald..',
	    message: 'Contact informatie is opgeladen.',
	    label: 'resource',
	    session: session.getSession()
	  },
	
	  function (data, label)
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
	    }];
	    for (var i in roles)
	    {
	      if (data.role == roles[i].value)
	      {
	        $('#editMember #roles').val(data.role).attr('selected', true);
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
	    {
	      path: '/parent?uuid=' + data.uuid,
	      loading: 'Parent groep informatie wordt opgeladen..',
	      label: 'parent group: ',
	      session: session.getSession()
	    },
	    function (data, label)
	    {
	      this.renderGroupsListUser(window.groups);
	      for (var i in data)
	      {
	        $('#groupsListEdit .chzn-select option[value="' + data[i].uuid + '"]').attr('selected', true);
	      }
	      $("#groupsListEdit .chzn-select").trigger("liszt:updated");
	    });
	  });
	},
*/

/*
	editMember: function(uuid)
	{
	  $('#editMember').modal('hide');
	  var uuid = $('#editMember #uuid').val();
	  webpaige.con(
	  {
	    path: '/parent?uuid=' + uuid,
	    loading: 'Parent groep informatie wordt opgeladen..',
	    label: 'parent group: ',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	  
		  // remove later
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
	      {
	        type: 'delete',
	        path: '/network/' + data[e].uuid + '/members/' + uuid,
	        loading: 'Gebruiker groepen aangepast..',
	        label: 'Contact is verwijderd.',
	        session: session.getSession()
	      },
	
	      function (data, label)
	      {
	        counter = counter - 1;
	        if (counter == 0)
	        {
	          var groups = $('#groupsListEdit select').val();
	          
	          console.log('groups to be added', groups);
	          
	          var ugroups = webpaige.config('ugroups');
	          for (var i in groups)
	          {
	            if (jQuery.inArray(groups[i], ugroups) == -1)
	            {
	              webpaige.con(
	              {
	                type: 'post',
	                path: '/network/' + groups[i] + '/members/' + uuid,
	                loading: 'Contact wordt toegevoegd in groep..',
	                label: 'Contact is toegevoegd in groep.',
	                session: session.getSession()
	              },
	
	              function (data, label)
	              {});
	            }
	          }
	        }
	      });
	    }
	    // remove later
	    
	    
	  });
	  var role = $('#editMember #roles').val();
	  var name = $('#editMember #name').val();
	  var tel = $('#editMember #tel').val();
	  var email = $('#editMember #email').val();
	  var address = $('#editMember #address').val();
	  var postcode = $('#editMember #postcode').val();
	  var city = $('#editMember #city').val();
	  var guuid = $('#editMember #guuid').val();
	  var tags = '{' + '"name":"' + name + '", ' + '"PhoneAddress":"' + tel + '", ' + '"EmailAddress":"' + email + '", ' + '"PostAddress":"' + address + '", ' + '"PostZip":"' + postcode + '", ' + '"PostCity":"' + city + '"' + '}';
	  webpaige.con(
	  {
	    type: 'put',
	    path: '/node/' + uuid + '/resource',
	    json: tags,
	    loading: 'Contact informatie wordt opgeslagen..',
	    message: 'Contact informatie is gewijzigd.',
	    label: 'member',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
		  // remove later
	    var groups = $('#groupsListEdit select').val();
	    
	    console.log('groups to be added', groups);
	    
	    var ugroups = webpaige.config('ugroups');
	    for (var i in groups)
	    {
	      if (jQuery.inArray(groups[i], ugroups) == -1)
	      {
	        webpaige.con(
	        {
	          type: 'post',
	          path: '/network/' + groups[i] + '/members/' + uuid,
	          loading: 'Contact wordt toegevoegd in groep..',
	          label: 'Contact is toegevoegd in groep.',
	          session: session.getSession()
	        },
	
	        function (data, label)
	        {});
	      }
	    }
	    // remove later  
	          
	    webpaige.con(
	    {
	      type: 'put',
	      path: '/node/' + uuid + '/role',
	      json: role,
	      loading: 'Contact role wordt opgeslagen..',
	      message: 'Contact role is gewijzigd.',
	      label: 'member',
	      session: session.getSession()
	    },
	    function (data, label)
	    {
	      // get group name for displaying later
	      webpaige.con(
	      {
	        path: '/network/' + guuid,
	        loading: 'Contacten worden opgeladen..',
	        label: 'members',
	        session: session.getSession()
	      },
	      function (data, label)
	      {
	        this.loadGroups(guuid, data.name);
	      });
	    });
	    
	  });
	},
*/

/*
	removeMembers: function(name, uuid)
	{
	  var specificTable = '#tb-' + uuid + ' input:checkbox:checked';
	  var values = $(specificTable).map(function ()
	  {
	    if (this.value != 'on')
	    {
	      this.removeMember(name, uuid, this.value);
	    }
	  }).get();
	},
*/

/*
	removeMember: function(name, uuid, memberUuid)
	{
	  webpaige.con(
	  {
	    type: 'delete',
	    path: '/network/' + uuid + '/members/' + memberUuid,
	    loading: 'Contact wordt verwijderd..',
	    label: 'Contact is verwijderd.',
	    session: session.getSession()
	  },
	
	  function (data, label)
	  {
	    //debugger; 
	    this.loadGroups(uuid, name);
	  });
	},
*/

	toggleChecked: function(uuid, status)
	{
	  var ids = "#tb-" + uuid.replace(/([@.:#])/g, '\\$1') + " input";
	  $(ids).each(function ()
	  {
	    $(this).attr("checked", status);
	  })
	},

	renderGroups: function(data, uuid, name)
	{
	  window.groups = data;
	  $('#groupsList').remove();
	  var groupsList = $('<ul id="groupsList" class="nav nav-list"></ul>');
	  $(groupsList).append('<li class="nav-header">Groepen</li>');
	  for (var i in data)
	  {
	    if (uuid == null && name == null && i == 0)
	    {
	      $(groupsList).append('<li class="active"><a onClick="loadGroups(\'' + data[i].uuid + '\', \'' + data[i].name + '\')">' + data[i].name + '</a></li>');
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
	      $(groupsList).append('<li' + active + '><a onClick="loadGroups(\'' + data[i].uuid + '\', \'' + data[i].name + '\')">' + data[i].name + '</a></li>');
	      var uuid = uuid;
	      var name = name;
	    }
	  }
	  $('#groupsNav').html(groupsList);
	  this.loadMembers(name, uuid);
	},

	renderMembers: function(json, name, uuid)
	{
	  var data = json;
	  $('#live').remove();
	  var live = $('<div id="live"></div>');
	  var btnGroup = $('<div class="btn-group btn-hanging"></div>');
	  //$(btnGroup).append('<a onClick="addNewMemberToGroup(\''+name+'\', \''+uuid+'\')" class="btn"><i class="icon-user"></i> Add new member</a>');
	  $(btnGroup).append('<a data-toggle="modal" href="#newGroup" class="btn"><i class="icon-plus"></i> Nieuwe groep</a>');
	  $(btnGroup).append('<a onClick="editGroupModalInit(\'' + name + '\', \'' + uuid + '\')" class="btn"><i class="icon-edit"></i> Bewerk groep</a>');
	  $(btnGroup).append('<a onClick="deleteGroup(\'' + uuid + '\')" class="btn"><i class="icon-remove"></i> Verwijder groep</a>');
	  $(live).append(btnGroup);
	  $(live).append('<div class="btn-group btn-hanging"><a data-toggle="modal" href="#newMember" onclick="addNewMember()" class="btn"><i class="icon-user"></i> Nieuwe contact</a></div>');
	  var title = $('<h2><span class="entypo eMedium">,</span> ' + name + '</h2><br>');
	  $(live).append(title);
	  if (data && data.length > 0)
	  //if (data)
	  {
	    var table = $('<table id="tb-' + uuid + '" class="table table-striped"></table>');
	    var thead = $('<thead><tr></tr></thead>');
	    thead.append('<th><input type="checkbox" onclick="toggleChecked(\'' + uuid + '\', this.checked)" /></th>');
	    thead.append('<th>Naam</th>');
	    thead.append('<th>Role</th>');
	    thead.append('<th>Telefoonnummer</th>');
	    thead.append('<th></th>');
	    table.append(thead);
	    var tbody = $('<tbody></tbody>');
	    for (var n in data)
	    {
	      var tbodytr = $('<tr></tr>');
	      tbodytr.append('<td><input type="checkbox" class="checkbox" value="' + data[n].uuid + '" /></td>');
	      tbodytr.append('<td><a onclick="editMemberModalInit(\'' + uuid + '\', \'' + data[n].uuid + '\');">' + data[n].name + '</a></td>');
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
	      }];
	      for (var i in roles)
	      {
	        if (data[n].resources.role == roles[i].value)
	        {
	          var role = roles[i].name;
	        }
	      }
	      tbodytr.append('<td>' + role + '</td>');
	      tbodytr.append('<td>' + data[n].resources.PhoneAddress + '</td>');
	      tbodytr.append('<td><a class="btn btn-mini" onclick="removeMember(\'' + name + '\', \'' + uuid + '\', \'' + data[n].uuid + '\');"><i class="icon-trash"></i> Verwijder</a></td>');
	      tbody.append(tbodytr);
	    }
	    tbody.append('<tr><td colspan="6"><a class="btn" onclick="removeMembers(\'' + name + '\', \'' + uuid + '\');"><i class="icon-trash"></i> Verwijder geselecteerde contacten</a></td></tr>');
	    table.append(tbody);
	    $(live).append(table);
	  }
	  else
	  {
	    $(live).append('<p>Er zijn geen contacten.</p>');
	  }
	  $('#content').html(live);
	},

/*
	renderSearch: function(data)
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
	    for (var n in data)
	    {
	      var tbodytr = $('<tr></tr>');
	      tbodytr.append('<td><input type="checkbox" class="checkbox" value="' + data[n].id + '" /></td>');
	      tbodytr.append('<td width="96%">' + data[n].name + '</td>');
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
	},
*/

/*
	renderAddGroupsList: function(groups)
	{
	  for (var i in groups)
	  {
	    $('#groupsAddList').append('<option value="' + groups[i].uuid + '">' + groups[i].name + '</option>');
	  }
	},
*/

	renderGroupsList: function(groups)
	{
	  for (var n in groups)
	  {
	    $('#groupsListNew .chzn-select').append("<option value=" + groups[n].uuid + ">" + groups[n].name + "</option>");
	  }
	  $("#groupsListNew .chzn-select").trigger("liszt:updated");
	},

	renderGroupsListUser: function(groups)
	{
	  for (var n in groups)
	  {
	    $('#groupsListEdit .chzn-select').append("<option value=" + groups[n].uuid + ">" + groups[n].name + "</option>");
	  }
	}

})

groups.$inject = ['$scope'];