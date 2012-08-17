$(document).ready(function()
{
  
 	pageInit('dashboard', 'true');
  
  getParentGroup();
  /*
  if (webpaige.getRole() == 3)
  {
	  $('#groupsList').css('display', 'none');
  }
  */
  renderGroupsList();	 
  	
  
  $('#planningFrom').datetimepicker();
  $('#planningTill').datetimepicker();
  $('#eplanningFrom').datetimepicker();
  $('#eplanningTill').datetimepicker();
  
  
  $("#planningAllDay").click(function()
  {
    if ($('input#planningAllDay:checkbox:checked').val() == "true")
    	$('#plTill').hide();
    else
    	$('#plTill').show();
  });
  
  timelineInit();
  
  
  
  if (webpaige.getRole() != 1)
  {
  	groupTimelineInit(webpaige.config('parentGroupUUID'), webpaige.config('parentGroupName'));
  }
  else
  {
  
	  var guuid = webpaige.config('firstGroupUUID');
	  var gname = webpaige.config('firstGroupName');
	  
	  console.log(gname, guuid);
	  
	  groupTimelineInit(guuid, gname);  
  }  
  
  
  
  
  
  if (webpaige.getRole() < 3)
	  membersTimelineInit(guuid);	
  
  
  
  $('#groupAvBtn').addClass('active');
  
  $("#groupsList").change(function()
  {
		var guuid = $(this).find(":selected").val();
	  groupTimelineInit(guuid, gname);  
	  membersTimelineInit(guuid);
	});
  
});






function getParentGroup()
{
	var resources = JSON.parse(webpaige.get('resources'));					
	webpaige.con(
		options = {
			path: '/parent',
			loading: 'Getting parent group..',
			label: 'parent group: '
			,session: session.getSession()	
		},
		function(data, label)
	  {
		  var datas = JSON.parse(data);	
	  	for (var i in datas)
	  	{	  		
	  		webpaige.config('parentGroupUUID', datas[i].uuid);	
	  		webpaige.config('parentGroupName', datas[i].name);		  	
	  	}
		}
	); 
}



	
var session = new ask.session();
var timeline;
var timeline2;
var timeline3;
var timeline_selected = null;



// Submitters
function planSubmit()
{
  $('#newEvent').modal('hide');
  var planningType = $('input#planningType[name="planningType"]:checked').val();
  var planningFrom = $('#planningFrom').val();
  var planningTill = $('#planningTill').val();
  var planningReoccuring = $('input#planningReoccuring:checkbox:checked').val();
  var planningAllDay = $('input#planningAllDay:checkbox:checked').val();
  if (planningReoccuring == "true") planningReoccuring = "true";
  else planningReoccuring = "false";
  var planningFrom = Date.parse(planningFrom, "dd-MMM-yyyy HH:mm");
  var planningFrom = planningFrom.getTime();
  var planningTill = Date.parse(planningTill, "dd-MMM-yyyy HH:mm");
  var planningTill = planningTill.getTime();
  addSlot(planningFrom, planningTill, planningReoccuring, planningType);
  $('#newEventForm')[0].reset();
}

function editPlanSubmit()
{
  $('#editEvent').modal('hide');
  var enewType = $('input#eplanningType[name="eplanningType"]:checked').val();
  var enewFrom = $('#eplanningFrom').val();
  var enewTill = $('#eplanningTill').val();
  var enewReoccuring = $('input#eplanningReoccuring:checkbox:checked').val();
  if (enewReoccuring == "true") enewReoccuring = "true"; else enewReoccuring = "false";
  var enewFrom = Date.parse(enewFrom, "dd-MMM-yyyy HH:mm");
  var enewFrom = enewFrom.getTime();
  var enewTill = Date.parse(enewTill, "dd-MMM-yyyy HH:mm");
  var enewTill = enewTill.getTime();
	window.newslot = {
		from:	Math.round(enewFrom/1000),
		till: Math.round(enewTill/1000),
		reoc: enewReoccuring,
		type: enewType
	};
	updateSlotModal();
  $('#editEventForm')[0].reset();
}

function deletePlanSubmit()
{
  $('#editEvent').modal('hide');
  deleteSlotModal(oldslot.from, oldslot.till, oldslot.reoc, oldslot.type);
  $('#editEventForm')[0].reset();
}





// Loaders
function loadGroupAvs()
{
	$('#groupAvBtn').addClass('active');
	$('#memberAvBtn').removeClass('active');
	$('#currentAvBtn').removeClass('active');
	getGroupSlots();
}

function loadMemberAvs()
{	
	$('#groupAvBtn').removeClass('active');
	$('#memberAvBtn').addClass('active');
	$('#currentAvBtn').removeClass('active');
	var uuid = $('#groupsList option:selected').val();
	getMemberSlots(uuid);
}

function loadCurrentAvs()
{
	$('#groupAvBtn').removeClass('active');
	$('#memberAvBtn').removeClass('active');
	$('#currentAvBtn').addClass('active');
	var uuid = $('#groupsList option:selected').val();
	getCurrentSlots(uuid);
}





// Timeline initators
function timelineInit()
{
  timeline_data = [];
  var options = {
  	'groupsWidth': '100px'
  };
  timeline = new links.Timeline(document.getElementById('mytimeline'));
  // Add event listeners
  google.visualization.events.addListener(timeline, 'edit', 	timelineOnEdit);
  google.visualization.events.addListener(timeline, 'add', 		timelineOnAdd);
  google.visualization.events.addListener(timeline, 'delete', timelineOnDelete);
  google.visualization.events.addListener(timeline, 'change', timelineOnChange);
  google.visualization.events.addListener(timeline, 'select', timelineOnSelect);
  google.visualization.events.addListener(timeline, 'rangechange', onRangeChanged1);
  getSlots();
}

function groupTimelineInit(guuid, gname)
{
	//debugger;
	
  getGroupSlots(guuid, gname);
}

function membersTimelineInit(uuid)
{
  timeline_data3 = [];
  var options = {
  	'groupsWidth': '100px'
  };
  timeline3 = new links.Timeline(document.getElementById('memberTimeline'));
  google.visualization.events.addListener(timeline3, 'rangechange', onRangeChanged3);
  timeline3.draw(timeline_data3, options);
  getMemberSlots(uuid);
}

function onRangeChanged1() 
{
  var range = timeline.getVisibleChartRange();
  timeline2.setVisibleChartRange(range.start, range.end);
  timeline3.setVisibleChartRange(range.start, range.end);
}  
      
function onRangeChanged2() 
{
  var range = timeline2.getVisibleChartRange();
  timeline.setVisibleChartRange(range.start, range.end);
  
  if (webpaige.getRole() != 3)
  {
  	timeline3.setVisibleChartRange(range.start, range.end);
  }
} 
     
function onRangeChanged3() 
{
  var range = timeline3.getVisibleChartRange();
  timeline.setVisibleChartRange(range.start, range.end);
  timeline2.setVisibleChartRange(range.start, range.end);
}





// Timeline events
function timelineOnAdd()
{
}

function timelineOnEdit()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var curItem = timeline.getItem(row);
  var content = timeline_data.getValue(row, 2);
  editSlotModal(curItem.start, curItem.end, curItem.group, timeline_helper_html2state(content));
}

function timelineOnDelete()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var oldItem = timeline.getItem(row);
  deleteSlot(oldItem.start / 1000, oldItem.end / 1000, oldItem.group, oldItem.content);
  timeline.cancelDelete();
}

function timelineOnSelect()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  timeline_selected = timeline.getItem(row);
}

function timelineOnChange()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var newItem = timeline.getItem(row);
  updateSlot(timeline_selected, newItem);
}





// Timeline CRUD's
function addSlot(from, till, reoc, value)
{
	var resources = JSON.parse(webpaige.get('resources'));
  var body = 	'{"end":' + (till / 1000) + 
  						',"recursive":' + reoc + 
  						',"start":' + (from / 1000) + 
  						',"text":"' + value + '"}';
	webpaige.con(
		options = {
			type: 'post',
			path: '/slots',
			json: body,
			loading: 'Adding new slot..'
			,session: session.getSession()	
		},
		function(data)
	  {  
			getSlots();
		}
	); 
}

function deleteSlot(from, till, reoc, value)
{
	var resources = JSON.parse(webpaige.get('resources'));
  var path = 	'/askatars/' 
  						+ resources.uuid + '/slots?start=' 
  						+ from + '&end=' 
  						+ till + '&text=' 
  						+ timeline_helper_html2state(value) 
  						
  						+ '&recursive=' 
  						+ (reoc == 'Re-occuring');
	webpaige.con(
		options = {
			type: 'delete',
			path: path,
			loading: 'Deleting slot..'
			,session: session.getSession()	
		},
		function(data)
	  {  
			getSlots();
		}
	); 
}

function deleteSlotModal(from, till, reoc, value)
{
	var resources = JSON.parse(webpaige.get('resources'));
  var path = 	'/askatars/' 
  						+ resources.uuid + '/slots?start=' 
  						+ from + '&end=' 
  						+ till + '&text=' 
  						+ value 
  						+ '&recursive=' 
  						+ (reoc == 'Re-occuring');
	webpaige.con(
		options = {
			type: 'delete',
			path: path,
			loading: 'Deleting slot..'
			,session: session.getSession()	
		},
		function(data)
	  {  
			getSlots();
		}
	); 
}

function updateSlotModal()
{
	var endof = Math.round(oldslot.till / 1000);
	var now = parseInt((new Date()).getTime() / 1000);
	if (oldslot.till > now)
	{
		var resources = JSON.parse(webpaige.get('resources'));
	  var query =	'start=' + newslot.from + 
	  						'&end=' + newslot.till + 
	  						'&text=' + newslot.type + 
	  						'&recursive=' + newslot.reoc; 
	  var body = '{"color":null' + 
	  						',"count":0' + 
	  						',"end":' + oldslot.till + 
	  						',"recursive":' + oldslot.reoc + 
	  						',"start":' + oldslot.from + 
	  						',"text":"' + oldslot.type + 
	  						'","wish":0}';
		webpaige.con(
			options = {
				type: 'put',
				path: '/askatars/'+resources.uuid+'/slots?'+query,
				json: body,
				loading: 'Updating slot..'
				,session: session.getSession()	
			},
			function(data)
		  { 
		  	if (data)
		  	{
		  		webpaige.message("Slot updated successfully!");
		  	} 
				getSlots();
			}
		);
	}
	else
	{
		timeline.cancelChange();
		alert('You are not allowed to change past events.');
	}
}

function updateSlot(oldSlot, newSlot)
{
	var endof = Math.round(oldSlot.end / 1000);
	var now = parseInt((new Date()).getTime() / 1000);
	if (endof > now)
	{
	  var oldState = oldSlot.content.split('>')[1].split('<')[0];
	  var newState = newSlot.content.split('>')[1].split('<')[0];
		var resources = JSON.parse(webpaige.get('resources'));
	  var query =	'start=' + Math.round(newSlot.start / 1000) + 
	  						'&end=' + Math.round(newSlot.end / 1000) + 
	  						'&text=' + newState + 
	  						'&recursive=' + (newSlot.group == 'Re-occuring');
	  var body = 	'{"color":null' + 
	  						',"count":0' + 
	  						',"end":' + Math.round(oldSlot.end / 1000) + 
	  						',"recursive":' + (oldSlot.group=='Re-occuring') + 
	  						',"start":' + Math.round(oldSlot.start/1000) + 
	  						',"text":"' + oldState + '"' +
	  						',"wish":0}';
		webpaige.con(
			options = {
				type: 'put',
				path: '/askatars/'+resources.uuid+'/slots?'+query,
				json: body,
				loading: 'Updating slot..'
				,session: session.getSession()	
			},
			function(data)
		  {  
				getSlots();
			}
		);
	}
	else
	{
		timeline.cancelChange();
		alert('You are not allowed to change past events.');
	}
}

function editSlotModal(efrom, etill, ereoc, evalue)
{
  var eoldSlotValue;
  var eoldRecursive;
  var eoldSlotFrom;
  var eoldSlotTill;
  $('#editEvent').modal('show');
  if (evalue == 'ask.state.1')
  {
    $('input#eplanningType')[0].checked = true;
  	eoldSlotValue = 'available';
  }
  else if (evalue == 'ask.state.2')
  {
    $('input#eplanningType')[1].checked = true;
  	eoldSlotValue = 'unavailable';
  }
  efrom = new Date(efrom.getTime());
  eoldSlotFrom = Math.round(efrom/1000);
  efrom = efrom.toString("dd-MMM-yyyy HH:mm");
  $('#eplanningFrom').val(efrom);
  etill = new Date(etill.getTime());
  eoldSlotTill = Math.round(etill/1000);
  etill = etill.toString("dd-MMM-yyyy HH:mm");
  $('#eplanningTill').val(etill);
  if (ereoc == 'Re-occuring')
  {
    $('input#eplanningReoccuring')[0].checked = true;
    eoldRecursive = true;
  }
  else if (ereoc == 'Plan')
  {
    $('input#eplanningReoccuring')[0].checked = false;
    eoldRecursive = false;
  }
	window.oldslot = {
		from: eoldSlotFrom,
		till: eoldSlotTill,
		reoc: eoldRecursive,
		type: eoldSlotValue
	};
}




// Timeline slots
function getSlots()
{
  var now = parseInt((new Date()).getTime() / 1000);
  var range =	'start=' + (now - 86400 * 7 * 0.5) + 
  						'&end=' + (now + 86400 * 7 * 0.5);
	var resources = JSON.parse(webpaige.get('resources'));					
	webpaige.con(
		options = {
			path: '/askatars/'+resources.uuid+'/slots?'+range,
			loading: 'Getting slots..',
			label: 'slots'
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	var slots = JSON.parse(data);  
			timeline_data = new google.visualization.DataTable();
			timeline_data.addColumn('datetime', 'start');
			timeline_data.addColumn('datetime', 'end');
			timeline_data.addColumn('string', 'content');
			timeline_data.addColumn('string', 'groups');
			for (var i in slots)
			{
			  var content = colorState(slots[i].text);
			  timeline_data.addRow([
			  	new Date(slots[i].start * 1000), 
			  	new Date(slots[i].end * 1000), 
			  	content, 
			  	slots[i].recursive ? 'Re-occuring' : 'Plan'
			  ]);
			}       
			var options = {
				editable: true
			};
			timeline.draw(timeline_data, options); 
		}
	); 
}

function getGroupSlots(guuid, gname)
{
  var now = parseInt((new Date()).getTime() / 1000);
	var resources = JSON.parse(webpaige.get('resources'));
  var range =	'start=' + (now - 86400 * 7 * 0.5) + 
  						'&end=' + (now + 86400 * 7 * 0.5);  
	webpaige.con(
		options = {
			path: '/calc_planning/'+guuid+'?'+range,
			loading: 'Getting group aggregiated slots..',
			label: gname
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	var ndata = [];
			var maxh = 0;
			for (var i in data)
			{
				if(data[i].wish>maxh)
					maxh=data[i].wish;
			}
			for (var i in data)
			{
	      var maxNum = maxh;
	      var num = data[i].wish;
	      var xwish = num;
		    var height = Math.round(num / maxNum * 80 + 20); // a percentage, with a lower bound on 20%
	      var minHeight = height;
	      var style = 'height:' + height + 'px;';
	              'title="Minimum requirement: ' + num + ' people"><span>' + num + '</span></div>';
	      var requirement = '<div class="requirement" style="' + style + '" ' +
	              'title="Minimum requirement: ' + num + ' people"></div>';
				num = data[i].wish + data[i].diff;
				var xcurrent = num;
				
				// a percentage, with a lower bound on 20%
		    height = Math.round(num / maxNum * 80 + 20);
		    
	      if (xcurrent < xwish)
	      {
	      	var color = '#a93232';
	      }
	      else if (xcurrent == xwish)
	      {
		      var color = '#e0c100';
	      }
	      else if (xcurrent > xwish)
	      {
		      var color = '#4f824f';
	      }
	      
	      if (xcurrent > xwish) {
	      	height = minHeight;
	      }
	      
	      style = 'height:' + height + 'px;' + 'background-color: ' + color + ';';
	      var actual = '<div class="bar" style="' + style + '" ' +
	              ' title="Actual: ' + num + ' people"><span class="badge badge-inverse">' + num + '</span></div>';
	      var item = {
	          'group': label,
	          'start': Math.round(data[i].start * 1000),
	          'end': Math.round(data[i].end * 1000),
	          'content': requirement + actual
	      };
	      ndata.push(item);
			} 
		  var options = {
		      "width":  "100%",
		      "height": 'auto',
		      "style": "box",
		      'selectable': false,
		      'editable': false,
		      'groupsWidth': '100px',
		      'eventMarginAxis': 0
		  };
		  timeline2 = new links.Timeline(document.getElementById('groupTimeline'));
		  google.visualization.events.addListener(timeline2, 'rangechange', onRangeChanged2);
		  timeline2.draw(ndata, options);
		}
	); 
}

function getMemberSlots(uuid)
{
	webpaige.con(
		options = {
			path: '/network/'+uuid+'/members',
			loading: 'Loading group member slots..',
			label: uuid
			,session: session.getSession()	
		},
		function(data, label)
	  {  
			timeline_data3 = new google.visualization.DataTable();
			timeline_data3.addColumn('datetime', 'start');
			timeline_data3.addColumn('datetime', 'end');
			timeline_data3.addColumn('string', 'content');
			timeline_data3.addColumn('string', 'groups');
	  	var members = JSON.parse(data);
	  	for (var i in members)
	  	{
				renderMemberSlots(members[i], members[i].name);
	  	}
			var options = {
		    'selectable': false,
		    'editable': false,
		    'snapEvents': false,
		    'groupChangeable': false
		  };
			timeline3.draw(timeline_data3, options);
		}
	);
}

function renderMemberSlots(member, name)
{  
  var now = parseInt((new Date()).getTime() / 1000);
  var range =	'start=' + (now - 86400 * 7 * 0.5) + 
  						'&end=' + (now + 86400 * 7 * 0.5);  
	webpaige.con(
		options = {
			path: '/askatars/'+member.uuid+'/slots?'+range,
			loading: 'Getting slots..',
			label: name
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	var slots = JSON.parse(data); 
				timeline3.addItem({
					'start':new Date(0),
					'end':new Date(0),
					'content':'available',
					'group': label + ' Re-occuring'
				});
				timeline3.addItem({
					'start':new Date(0),
					'end':new Date(0),
					'content':'available',
					'group': label + ' Plan'
				});
			for (var i in slots)
			{
			  var content = colorState(slots[i].text);
				timeline3.addItem({
					'start':new Date(slots[i].start * 1000),
					'end':new Date(slots[i].end * 1000),
					'content':content,
					'group':slots[i].recursive ? label + ' Re-occuring' : label + ' Plan'
				});
			}  
		}
	);     
}

function getCurrentSlots(uuid)
{
	webpaige.con(
		options = {
			path: '/network/'+uuid+'/members',
			loading: 'Loading group member slots..',
			label: uuid
			,session: session.getSession()	
		},
		function(data, label)
	  {  
	  	var members = JSON.parse(data);
	  	window.currents = {};
	  	for (var i in members)
	  	{
				window.currents[members[i].name] = '';
			  var now = parseInt((new Date()).getTime() / 1000);
			  var range =	'start=' + (now - 1) + '&end=' + (now + 1); 
				window.currents = {};
				webpaige.con(
					options = {
						path: '/askatars/'+members[i].uuid+'/slots?'+range,
						loading: 'Getting slots..',
						label: 'slots'
						,session: session.getSession()	
					},
					function(data, label)
				  {
				  	var slots = JSON.parse(data);
						for (var i in slots)
						{
							window.currents[members[i].name] = slots[i];  
						}
					}
				); 
	  	}
	  	console.log('currents :', window.currents);  
		}
	);
}

function renderCurrentSlots(member)
{
  var now = parseInt((new Date()).getTime() / 1000);
  var range =	'start=' + (now - 1) + '&end=' + (now + 1);  
	webpaige.con(
		options = {
			path: '/askatars/'+member.uuid+'/slots?'+range,
			loading: 'Getting slots..',
			label: 'slots'
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	var slots = JSON.parse(data); 
			for (var i in slots)
			{
				console.log('current :', slots[i]);  
			}  
		}
	); 
}




// Slot makeups
function colorState(state)
{
  var content = '?';
  if (state == 'available') return '<div class="available">' + state + '</div>';
  if (state == 'unavailable') return '<div class="unavailable">' + state + '</div>';
}

function timeline_helper_state2html(state)
{
  var state_map = {
	    'ask.state.1': ['available', 'green'],
	    'ask.state.2': ['unavailable', 'red']
	 };
  var content = '?';
  if (state_map[state])
  	return '<div style="background-color:' + state_map[state][1] + '">' + state_map[state][3] + '</div>';
}

function timeline_helper_html2state(content)
{
  var state_map = {
	    'ask.state.1': ['available', 'green'],
	    'ask.state.2': ['unavailable', 'red']
	 };
  var state = content.split('>')[1].split('<')[0];
  //reverse map search..
  for (var i in state_map)
  {
    if (state == state_map[i][0]) return i;
  }
  return state;
}
    
    
    
        

// Group list producers
function renderGroupsList()
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
		  for(var i in data)
		  {
			  /*
		  	if (i == 0)
		  	{
		  		webpaige.config('firstGroupUUID', data[i].uuid);
		  		webpaige.config('firstGroupName', data[i].name);
		  	}	
		  	*/ 
		  	$('#groupsList').append('<option value="'+data[i].uuid+'">'+data[i].name+'</option>');		    
		  }
		}
	);
}

function loadGroupsList()
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
    	window.groups = data;
		}
	);
}




// Timeline navigations
function timelineZoomIn()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.zoom(0.4);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}

function timelineZoomOut()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.zoom(-0.4);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}

function timelineMoveLeft()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.move(-0.2);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}

function timelineMoveRight()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.move(0.2);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}