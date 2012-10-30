/* http://3rc2.ask-services.appspot.com/ns_knrm/network/6499d976-67fb-1030-a3ab-005056bc7e66/member/slots?start=1349086283&end=1351505483 */


$(document).ready(function()
{
  
 	pageInit('dashboard', 'true');
 	
  var trange = webpaige.config('trange');
  window.range =	'start=' + trange.bstart + 
  								'&end=' + trange.bend;
  						
  
  //getParentGroup();
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
  
  
/*
  $("#planningAllDay").click(function()
  {
    if ($('input#planningAllDay:checkbox:checked').val() == "true")
    	$('#plTill').hide();
    else
    	$('#plTill').show();
  });
*/

	timelineHeaderInit();
  
  timelineInit();
  
  
  
	var guuid = webpaige.config('firstGroupUUID');
	var gname = webpaige.config('firstGroupName');
		webpaige.config('guuid', guuid);
		webpaige.config('gname', gname);
	groupTimelineInit(guuid, gname);
	// Depreciated 
	/*
  if (webpaige.getRole() > 2)
  {
  	groupTimelineInit(webpaige.config('parentGroupUUID'), webpaige.config('parentGroupName'));
  	//groupTimelineInit(webpaige.config('parentGroupUUID'), webpaige.config('parentGroupName'));
  }
  else
  {
	  var guuid = webpaige.config('firstGroupUUID');
	  var gname = webpaige.config('firstGroupName');
	  //console.log(gname, guuid);
	  groupTimelineInit(guuid, gname);  
  }  
  */
  
  
  
  
  
  //if (webpaige.getRole() < 3)
	  membersTimelineInit(guuid);	
  
  
  
  $('#groupAvBtn').addClass('active');
  
  $("#groupsList").change(function()
  {
  	$('#divisions option[value="both"]').attr('selected','selected');
  	
  	timelineInit();
		var guuid = $(this).find(":selected").val();
		var gname = $(this).find(":selected").text();
		
		
		webpaige.config('guuid', guuid);
		webpaige.config('gname', gname);
	
	
	  groupTimelineInit(guuid, gname);
	  //if (webpaige.getRole() < 3)  
	  	membersTimelineInit(guuid);
	});
	
	
	
	$('#newEventBtn').click(function()
	{
		var resources = JSON.parse(webpaige.get('resources'));
		$('#userWho').val(resources.uuid);  
		$('#newEvent').modal('show');
	});
  
  
  
  $(window).bind('resize', function ()
  {
	  timeline.redraw();
	  timeline2.redraw();
	  timeline3.redraw();
  });
  

	var local = {
		title: 'dashboard_title',
		statics: ['dashboard_today', 'dashboard_new_availability', 'dashboard_status', 'dashboard_available', 'dashboard_available_noord', 'dashboard_available_zuid', 'dashboard_unavailable', 'dashboard_from', 'dashboard_till', 'dashboard_weekly', 'dashboard_cancel', 'dashboard_save_planning', 'dashboard_edit_availability', 'dashboard_delete_planning', 'dashboard_save_planning', 'dashboard_planboard']		
	}
	webpaige.i18n(local);
	
	
	
  
  $("#divisions").change(function()
  {
		var division = $(this).find(":selected").val();
		timeline2.draw(webpaige.config(division));
	});
	
	
  
});






/*
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
*/



	
//var session = new ask.session();
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
  
  
	 var state = '';
	 switch (planningType)
	 {
		 case 'available':
		 	state = 'com.ask-cs.State.Available';
		 break;
		 case 'availableN':
		 	state = 'com.ask-cs.State.KNRM.BeschikbaarNoord';
		 break;
		 case 'availableZ':
		 	state = 'com.ask-cs.State.KNRM.BeschikbaarZuid';
		 break;
		 case 'schipper':
		 	state = 'com.ask-cs.State.KNRM.SchipperVanDienst';
		 break;
		 case 'unavailable':
		 	state = 'com.ask-cs.State.Unavailable';
		 break;
	 }
	 
	
  var userWho = $('#userWho').val();
  addSlot(planningFrom, planningTill, planningReoccuring, state, userWho);
  $('#newEventForm')[0].reset();
}

function editPlanSubmit()
{
  $('#editEvent').modal('hide');
  
  var enewType = $('input#eplanningType[name="eplanningType"]:checked').val();
  
  
	 var state = '';
	 switch (enewType)
	 {
		 case 'available':
		 	state = 'com.ask-cs.State.Available';
		 break;
		 case 'availableN':
		 	state = 'com.ask-cs.State.KNRM.BeschikbaarNoord';
		 break;
		 case 'availableZ':
		 	state = 'com.ask-cs.State.KNRM.BeschikbaarZuid';
		 break;
		 case 'schipper':
		 	state = 'com.ask-cs.State.KNRM.SchipperVanDienst';
		 break;
		 case 'unavailable':
		 	state = 'com.ask-cs.State.Unavailable';
		 break;
	 }
  
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
		//type: enewType,
		type: state
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
/*
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
*/





// Timeline initators
function timelineInit()
{
  timeline_data = [];
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
  
  if (webpaige.getRole() == 1)
  {
	  // Add event listeners
	  google.visualization.events.addListener(timeline3, 'edit', 	timelineOnEdit2);
	  google.visualization.events.addListener(timeline3, 'add', 	timelineOnAdd2);
	  google.visualization.events.addListener(timeline3, 'delete', timelineOnDelete2);
	  google.visualization.events.addListener(timeline3, 'change', timelineOnChange2);
	  google.visualization.events.addListener(timeline3, 'select', timelineOnSelect2);
  }
  
  google.visualization.events.addListener(timeline3, 'rangechange', onRangeChanged3);
  
	timeline3.setVisibleChartRange( window.tstart, window.tend ); 
			
  timeline3.draw(timeline_data3, options);
  getMemberSlots(uuid);
}

function timelineHeaderInit()
{
		  var trange = webpaige.config('trange');
  timeline_data4 = [];
  var options = {
			    'selectable': false,
			    'editable': false,
			    'snapEvents': false,
			    'groupChangeable': false,
	        'min': new Date(trange.start),                 // lower limit of visible range
	        'max': new Date(trange.end),   
	        //'min': new Date(2012, 0, 1),                 // lower limit of visible range
	        //'max': new Date(2012, 11, 31),               // upper limit of visible range
	        //'min': trange.start,                 // lower limit of visible range
	        //'max': trange.end,               // upper limit of visible range
	        'intervalMin': 1000 * 60 * 60 * 24,          // one day in milliseconds
	        'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2,   // about three months in milliseconds,
  	//'height': '48px',
  	'groupsWidth': '100px',
  	'axisOnTop': true
  };
  timeline4 = new links.Timeline(document.getElementById('timelineHeader'));
  
  google.visualization.events.addListener(timeline4, 'rangechange', onRangeChanged4);
  
	//timeline4.setVisibleChartRange( window.tstart, window.tend ); 
			
  timeline4.draw(timeline_data4, options);
	timeline4.addItem({
		'start':new Date(0),
		'end':new Date(0),
		'content':'available',
		'group': 'no group'
	});
		  timeline4.setVisibleChartRange(trange.start, trange.end);
}





function onRangeChanged1() 
{
  var range = timeline.getVisibleChartRange();
  timeline2.setVisibleChartRange(range.start, range.end);
  
/*
  if (webpaige.getRole() != 3)
  {
*/
  timeline3.setVisibleChartRange(range.start, range.end);
  timeline4.setVisibleChartRange(range.start, range.end);
/*   } */
}  
      
function onRangeChanged2() 
{
  var range = timeline2.getVisibleChartRange();
  timeline.setVisibleChartRange(range.start, range.end);
  
/*
  if (webpaige.getRole() != 3)
  {
*/
  	timeline3.setVisibleChartRange(range.start, range.end);
  	timeline4.setVisibleChartRange(range.start, range.end);
/*   } */
} 
     
function onRangeChanged3() 
{
  var range = timeline3.getVisibleChartRange();
  timeline.setVisibleChartRange(range.start, range.end);
  timeline2.setVisibleChartRange(range.start, range.end);
  timeline4.setVisibleChartRange(range.start, range.end);
}
     
function onRangeChanged4() 
{
  var range = timeline4.getVisibleChartRange();
  timeline.setVisibleChartRange(range.start, range.end);
  timeline2.setVisibleChartRange(range.start, range.end);
  timeline3.setVisibleChartRange(range.start, range.end);
}





// Timeline events
function timelineOnAdd()
{
	timeline.cancelAdd();
	
	var resources = JSON.parse(webpaige.get('resources'));
	$('#userWho').val(resources.uuid);
	
	$('#newEvent').modal('show');
}

function timelineOnEdit()
{
/*
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var curItem = timeline.getItem(row);
  var content = timeline_data.getValue(row, 2);
	
	var resources = JSON.parse(webpaige.get('resources'));
	
	var user = {
		uuid: resources.uuid
	};
*/
	
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var curItem = timeline.getItem(row);
  var content = timeline_data.getValue(row, 2);
  
  var user = $.trim(timeline.getItem(row).group.split('>')[3].split('<')[0]);
  user = user.split(':');
  
  var real = {
	  uuid : user[0],
	  reoc : user[1]
  };
  
  editSlotModal(curItem.start, curItem.end, trimSpan(curItem.group), html2state(content), real);
}

function timelineOnDelete()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var oldItem = timeline.getItem(row);
  
  var user = $.trim(timeline.getItem(row).group.split('>')[3].split('<')[0]);
  user = user.split(':');
  
  var real = {
	  uuid : user[0],
	  reoc : user[1]
  };
  
  deleteSlot(oldItem.start / 1000, oldItem.end / 1000, oldItem.group, oldItem.content, real);
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
  
  var user = $.trim(timeline.getItem(row).group.split('>')[3].split('<')[0]);
  user = user.split(':');
  
  var real = {
	  uuid : user[0],
	  reoc : user[1]
  };
  
  console.log(timeline_selected, newItem, real);
  
  updateSlot(timeline_selected, newItem, real);
}





// Timeline Members events
function timelineOnAdd2()
{
	timeline3.cancelAdd();
	
  var sel = timeline3.getSelection();
  var row = sel[0].row;
  
  var user = $.trim(timeline3.getItem(row).group.split('>')[1].split('<')[0]);
  user = user.split(':');
  
	$('#userWho').val(user[0]);  
  
	$('#newEvent').modal('show');
}

function timelineOnEdit2()
{
  var sel = timeline3.getSelection();
  var row = sel[0].row;
  var curItem = timeline3.getItem(row);
  var content = timeline_data3.getValue(row, 2);
  
  var user = $.trim(timeline3.getItem(row).group.split('>')[1].split('<')[0]);
  user = user.split(':');
  
  var real = {
	  uuid : user[0],
	  reoc : user[1]
  };
  
  editSlotModal(curItem.start, curItem.end, trimSpan(curItem.group), html2state(content), real);
}

function timelineOnDelete2()
{
  var sel = timeline3.getSelection();
  var row = sel[0].row;
  var oldItem = timeline3.getItem(row);
  
  var user = $.trim(timeline3.getItem(row).group.split('>')[1].split('<')[0]);
  user = user.split(':');
  
  var real = {
	  uuid : user[0],
	  reoc : user[1]
  };
  
  deleteSlot(oldItem.start / 1000, oldItem.end / 1000, oldItem.group, oldItem.content, real);
  timeline.cancelDelete();
}

function timelineOnSelect2()
{
  var sel = timeline3.getSelection();  
  var row = sel[0].row;
  timeline_selected = timeline3.getItem(row);
}

function timelineOnChange2()
{
  var sel = timeline3.getSelection();
  var row = sel[0].row;
  var newItem = timeline3.getItem(row);
  
  var user = $.trim(timeline3.getItem(row).group.split('>')[1].split('<')[0]);
  user = user.split(':');
  
  var real = {
	  uuid : user[0],
	  reoc : user[1]
  };
  
  updateSlot(timeline_selected, newItem, real);
}





// Timeline CRUD's
function addSlot(from, till, reoc, value, user)
{
	// resources ?
	var resources = JSON.parse(webpaige.get('resources'));
	
	var now = parseInt((new Date()).getTime());
	
	console.log('passed values', from, till, reoc, value, user, now);
	
	
	if (from < now || till < now)
	{
		alert('Het is niet toegestaan ​​om gebeurtenissen in het verleden te toevoegen.');		
	}
	else
	{
		
			 var label = {
				 gname : webpaige.config('gname'),
				 guuid : webpaige.config('guuid')
			 };	
			 
	  var body = 	'{"end":' + (till / 1000) + 
	  						',"recursive":' + reoc + 
	  						',"start":' + (from / 1000) + 
	  						',"text":"' + value + '"}';
		webpaige.con(
			options = {
				type: 'post',
				path: '/askatars/'+user+'/slots',
				json: body,
				label: label,
				loading: 'Nieuwe beschikbaarheid aan het toevoegen..'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
				getSlots();
					
					getGroupSlots(label.guuid, label.gname);
					getMemberSlots(label.guuid);
			}
		);
		
	} 
}





// Timeline CRUD's
/*
function addSlot(from, till, reoc, value, user)
{
	// resources ?
	var resources = JSON.parse(webpaige.get('resources'));
		
		 var label = {
			 gname : webpaige.config('gname'),
			 guuid : webpaige.config('guuid')
		 };	
		 
  var body = 	'{"end":' + (till / 1000) + 
  						',"recursive":' + reoc + 
  						',"start":' + (from / 1000) + 
  						',"text":"' + value + '"}';
	webpaige.con(
		options = {
			type: 'post',
			path: '/slots',
			json: body,
			label: label,
			loading: 'Nieuwe beschikbaarheid aan het toevoegen..'
			,session: session.getSession()	
		},
		function(data, label)
	  {  
			getSlots();
				
				getGroupSlots(label.guuid, label.gname);
				getMemberSlots(label.guuid);
		}
	); 
}
*/


// check delete slot
function deleteSlot(from, till, reoc, value, user)
{

	//console.log(from, till, reoc, value, user);
	
	var now = parseInt((new Date()).getTime() / 1000);
	
	//console.log('from : ', from, '    now : ', now);
		
		 var label = {
			 gname : webpaige.config('gname'),
			 guuid : webpaige.config('guuid')
		 };	
	
	if (from > now)
	{
		// resources ?
		//var resources = JSON.parse(webpaige.get('resources'));
	  var path = 	'/askatars/' 
	  						+ user.uuid + '/slots?start=' 
	  						+ from + '&end=' 
	  						+ till + '&text=' 
	  						+ timeline_helper_html2state2(value) 
	  						+ '&recursive=' 
	  						+ user.reoc;
		webpaige.con(
			options = {
				type: 'delete',
				path: path,
				label: label,
				loading: 'De beschikbaarheid wordt verwijderd..'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
				getSlots();
				
				getGroupSlots(label.guuid, label.gname);
				getMemberSlots(label.guuid);
			}
		);  
	}
	else
	{
		timeline.cancelChange();
		alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
	}
}

function deleteSlotModal(from, till, reoc, value)
{
	var user = {
		uuid : $('#userWhoEdit').val(),
		reoc : $('#userReocEdit').val()
	}; 
	
	var now = parseInt((new Date()).getTime() / 1000);
		
		 var label = {
			 gname : webpaige.config('gname'),
			 guuid : webpaige.config('guuid')
		 };	
		 
	if (from > now)
	{
		var resources = JSON.parse(webpaige.get('resources'));
	  var path = 	'/askatars/' 
	  						+ user.uuid + '/slots?start=' 
	  						+ from + '&end=' 
	  						+ till + '&text=' 
	  						+ value 
	  						+ '&recursive=' 
	  						+ user.reoc;
		webpaige.con(
			options = {
				type: 'delete',
				path: path,
				label: label,
				loading: 'De beschikbaarheid wordt verwijderd..'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
				getSlots();
				
				getGroupSlots(label.guuid, label.gname);
				getMemberSlots(label.guuid);
			}
		); 
	}
	else
	{
		timeline.cancelChange();
		alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
	}
}

function updateSlotModal()
{
	var endof = Math.round(oldslot.till / 1000);
	var now = parseInt((new Date()).getTime() / 1000);
	if (oldslot.till > now)
	{
		// resources ?
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
		
		var user = (oldslot.uuid != 'own') ? oldslot.uuid : resources.uuid;
		
		//console.log('passed uuid: ', oldslot.uuid);
		
		 var label = {
			 gname : webpaige.config('gname'),
			 guuid : webpaige.config('guuid')
		 };	
	 
		webpaige.con(
			options = {
				type: 'put',
				path: '/askatars/'+user+'/slots?'+query,
				json: body,
				label: label,
				loading: 'De beschikbaarheid wordt gewijzigd..'
				,session: session.getSession()	
			},
			function(data, label)
		  { 
		  	if (data)
		  	{
		  		webpaige.message("De beschikbaarheid is gewijzigd!");
		  	} 
				getSlots();
				
				//console.log('lab: ', label);
				
				getGroupSlots(label.guuid, label.gname);
				getMemberSlots(label.guuid);
			}
		);
	}
	else
	{
		timeline.cancelChange();
		alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
	}
}




function updateSlot(oldSlot, newSlot, user)
{
	var startof = Math.round(oldSlot.start / 1000);
	var endof = Math.round(oldSlot.end / 1000);
	var now = parseInt((new Date()).getTime() / 1000);
	
	if (endof > now)
	{
	  var oldState = oldSlot.content.split('>')[1].split('<')[0];
	  var newState = newSlot.content.split('>')[1].split('<')[0];
		
	  var query =	'start=' + Math.round(newSlot.start / 1000) + 
	  						'&end=' + Math.round(newSlot.end / 1000) + 
	  						'&text=' + newState + 
	  						'&recursive=' + user.reoc;
	  var body = 	'{"color":null' + 
	  						',"count":0' + 
	  						',"end":' + Math.round(oldSlot.end / 1000) + 
	  						',"recursive":' + user.reoc + 
	  						',"start":' + Math.round(oldSlot.start/1000) + 
	  						',"text":"' + oldState + '"' +
	  						',"wish":0}';
	 
	 var label = {
		 gname : webpaige.config('gname'),
		 guuid : webpaige.config('guuid')
	 };						
		webpaige.con(
			options = {
				type: 'put',
				path: '/askatars/'+ user.uuid +'/slots?'+query,
				json: body,
				label: label,
				loading: 'De beschikbaarheid wordt gewijzigd..'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
				getSlots();
				getGroupSlots(label.guuid, label.gname);
				getMemberSlots(label.guuid);
			}
		);
	}
	/*
	else if (endof < now && startof > now)
	{
	}
	*/
	else
	{
		timeline.cancelChange();
		alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
	}
}





function editSlotModal(efrom, etill, ereoc, evalue, user)
{
	  						
	//console.log('user: ', user.uuid, user.reoc);
	
	$('#userWhoEdit').val(user.uuid); 
	$('#userReocEdit').val(user.reoc); 
	  
	  
  var eoldSlotValue;
  var eoldRecursive;
  var eoldSlotFrom;
  var eoldSlotTill;
  $('#editEvent').modal('show');
  
  
  /*
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
  */
  
  
  switch (evalue)
  {
	  case 'com.ask-cs.State.Available':
    	$('input#eplanningType')[0].checked = true;
    	eoldSlotValue = 'com.ask-cs.State.Available';
	  break;
	  case 'com.ask-cs.State.KNRM.BeschikbaarNoord':
    	$('input#eplanningType')[1].checked = true;
    	eoldSlotValue = 'com.ask-cs.State.KNRM.BeschikbaarNoord';
	  break;
	  case 'com.ask-cs.State.KNRM.BeschikbaarZuid':
    	$('input#eplanningType')[2].checked = true;
    	eoldSlotValue = 'com.ask-cs.State.KNRM.BeschikbaarZuid';
	  break;
	  case 'com.ask-cs.State.KNRM.SchipperVanDienst':
    	$('input#eplanningType')[3].checked = true;
    	eoldSlotValue = 'com.ask-cs.State.KNRM.SchipperVanDienst';
	  break;
	  case 'com.ask-cs.State.Unavailable':
    	$('input#eplanningType')[4].checked = true;
    	eoldSlotValue = 'com.ask-cs.State.Unavailable';
	  break;
  }
  
  efrom = new Date(efrom.getTime());
  eoldSlotFrom = Math.round(efrom/1000);
  efrom = efrom.toString("dd-MMM-yyyy HH:mm");
  $('#eplanningFrom').val(efrom);
  etill = new Date(etill.getTime());
  eoldSlotTill = Math.round(etill/1000);
  etill = etill.toString("dd-MMM-yyyy HH:mm");
  $('#eplanningTill').val(etill);
  
/*
  if (user.reoc == true)
  {
    $('input#eplanningReoccuring')[0].checked = true;
    //eoldRecursive = true;
  }
  else if (user.reoc == false)
  {
    $('input#eplanningReoccuring')[0].checked = false;
    //eoldRecursive = false;
  }
*/
  
  $('input#eplanningReoccuring')[0].checked = eval(user.reoc);
  
	window.oldslot = {
		from: eoldSlotFrom,
		till: eoldSlotTill,
		//reoc: eoldRecursive,
		reoc: user.reoc,
		type: eoldSlotValue,
		uuid: user.uuid
	};
	
	//console.log('old slot:', window.oldslot);
	
}




// Timeline slots
function getSlots()
{
	var resources = JSON.parse(webpaige.get('resources'));					
	webpaige.con(
		options = {
			path: '/askatars/'+resources.uuid+'/slots?'+window.range,
			loading: 'De beschikbaarheiden worden opgeladen..',
			label: 'slots'
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	var slots = data;  
			timeline_data = new google.visualization.DataTable();
			timeline_data.addColumn('datetime', 'start');
			timeline_data.addColumn('datetime', 'end');
			timeline_data.addColumn('string', 'content');
			timeline_data.addColumn('string', 'group');
			for (var i in slots)
			{
			
				var resources = JSON.parse(webpaige.get('resources'));
			
			  var content = colorState(slots[i].text);
			  timeline_data.addRow([
			  	new Date(slots[i].start * 1000), 
			  	new Date(slots[i].end * 1000), 
			  	content, 
			  	slots[i].recursive ? '<span style="display:none;">b</span>Wekelijkse terugkerend<span style="display:none;">'+resources.uuid+':true</span>' : '<span style="display:none;">a</span>Planning<span style="display:none;">'+resources.uuid+':false</span>'
			  ]);
			}      
			
			
		  var trange = webpaige.config('trange');
		  
		  //console.log('own timeline start:', trange.start);
		  //console.log('own timeline end:', trange.end);
		  
		  
		  var options = {
		    'selectable': true,
		    'editable': true,
		  	'height': 'auto',
		  	'groupsWidth': '100px',
        'min': new Date(trange.start),                 // lower limit of visible range
        'max': new Date(trange.end),               	// upper limit of visible range
        //'min': new Date(2012, 0, 1),                 // lower limit of visible range
        //'max': new Date(2012, 11, 31),               // upper limit of visible range
        'intervalMin': 1000 * 60 * 60 * 24,          // one day in milliseconds
        'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2,   // about three months in milliseconds,
        'showMajorLabels': false,
        'showMinorLabels': false
		  };
			
			timeline.draw(timeline_data, options); 
			
			
			
			timeline.addItem({
				'start':new Date(0),
				'end':new Date(0),
				'content':'available',
				'group': '<span style="display:none;">b</span>Wekelijkse terugkerend<span style="display:none;">'+resources.uuid+':true</span>'
			});
			timeline.addItem({
				'start':new Date(0),
				'end':new Date(0),
				'content':'available',
				'group': '<span style="display:none;">a</span>Planning<span style="display:none;">'+resources.uuid+':false</span>'
			});
		  
		  //var trange = webpaige.config('trange');
		  timeline.setVisibleChartRange(trange.start, trange.end);
			
		  //console.log('user :', JSON.stringify(trange));
		}
	); 
}

function getGroupSlots(guuid, gname)
{
	var resources = JSON.parse(webpaige.get('resources'));
	webpaige.con(
		options = {
			path: '/calc_planning/'+guuid+'?'+window.range,
			loading: 'Groepsbeschikbaarheid wordt geladen..',
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
	              'title="Minimum aantal benodigden: ' + num + ' personen"><span>' + num + '</span></div>';
	      var requirement = '<div class="requirement" style="' + style + '" ' +
	              'title="Minimum aantal benodigden: ' + num + ' personen"></div>';
				num = data[i].wish + data[i].diff;
				var xcurrent = num;
				
				// a percentage, with a lower bound on 20%
		    height = Math.round(num / maxNum * 80 + 20);
		    
	      if (xcurrent < xwish)
	      {
	      	var color = '#a93232';
	      	var span = '';
	      }
	      else if (xcurrent == xwish)
	      {
		      var color = '#e0c100';
	      	var span = '';
	      }
	      else if (xcurrent > xwish)
	      {
	      	switch (num)
	      	{
		      	case 1:
		      		var color = '#4f824f';
		      	break;
		      	case 2:
		      		var color = '#477547';
		      	break;
		      	case 3:
		      		var color = '#436f43';
		      	break;
		      	case 4:
		      		var color = '#3d673d';
		      	break;
		      	case 5:
		      		var color = '#396039';
		      	break;
		      	case 6:
		      		var color = '#335833';
		      	break;
		      	case 7:
		      		var color = '#305330';
		      	break;
		      	default:
		      		var color = '#294929';
	      	}
	      	var span = '<span class="badge badge-inverse">' + num + '</span>';
	      }
	      
	      if (xcurrent > xwish) {
	      	height = minHeight;
	      }
	      
	      style = 'height:' + height + 'px;' + 'background-color: ' + color + ';';
	      var actual = '<div class="bar" style="' + style + '" ' +
	              ' title="Huidig aantal beschikbaar: ' + num + ' personen">'+span+'</div>';
	      var item = {
	          'group': label,
	          'start': Math.round(data[i].start * 1000),
	          'end': Math.round(data[i].end * 1000),
	          'content': requirement + actual
	      };
	      ndata.push(item);
			} 
			webpaige.config('both', ndata);
			
			
			
			
			
			
			webpaige.con(
				options = {
					path: '/calc_planning/'+guuid+'?'+window.range+'&stateGroup=knrm.StateGroup.BeschikbaarNoord',
					loading: 'Groepsbeschikbaarheid voor Noord wordt geladen..',
					label: gname + ' Station Noord'
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
			              'title="Minimum aantal benodigden: ' + num + ' personen"><span>' + num + '</span></div>';
			      var requirement = '<div class="requirement" style="' + style + '" ' +
			              'title="Minimum aantal benodigden: ' + num + ' personen"></div>';
						num = data[i].wish + data[i].diff;
						var xcurrent = num;
						
						// a percentage, with a lower bound on 20%
				    height = Math.round(num / maxNum * 80 + 20);
				    
			      if (xcurrent < xwish)
			      {
			      	var color = '#a93232';
			      	var span = '';
			      }
			      else if (xcurrent == xwish)
			      {
				      var color = '#e0c100';
			      	var span = '';
			      }
			      else if (xcurrent > xwish)
			      {
			      	switch (num)
			      	{
				      	case 1:
				      		var color = '#4f824f';
				      	break;
				      	case 2:
				      		var color = '#477547';
				      	break;
				      	case 3:
				      		var color = '#436f43';
				      	break;
				      	case 4:
				      		var color = '#3d673d';
				      	break;
				      	case 5:
				      		var color = '#396039';
				      	break;
				      	case 6:
				      		var color = '#335833';
				      	break;
				      	case 7:
				      		var color = '#305330';
				      	break;
				      	default:
				      		var color = '#294929';
			      	}
			      	var span = '<span class="badge badge-inverse">' + num + '</span>';
			      }
			      
			      if (xcurrent > xwish) {
			      	height = minHeight;
			      }
			      
			      style = 'height:' + height + 'px;' + 'background-color: ' + color + ';';
			      var actual = '<div class="bar" style="' + style + '" ' +
			              ' title="Huidig aantal beschikbaar: ' + num + ' personen">'+span+'</div>';
			      var item = {
			          'group': label,
			          'start': Math.round(data[i].start * 1000),
			          'end': Math.round(data[i].end * 1000),
			          'content': requirement + actual
			      };
			      ndata.push(item);
					}
			    
			    webpaige.config('north', ndata);  
		      //window.northndata = ndata;
		      //console.log('north: ', window.northndata); 
		  
				}
			); 
			
			
			
			
			
			
			webpaige.con(
				options = {
					path: '/calc_planning/'+guuid+'?'+window.range+'&stateGroup=knrm.StateGroup.BeschikbaarZuid',
					loading: 'Groepsbeschikbaarheid voor Noord wordt geladen..',
					label: gname + ' Station Zuid'
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
			              'title="Minimum aantal benodigden: ' + num + ' personen"><span>' + num + '</span></div>';
			      var requirement = '<div class="requirement" style="' + style + '" ' +
			              'title="Minimum aantal benodigden: ' + num + ' personen"></div>';
						num = data[i].wish + data[i].diff;
						var xcurrent = num;
						
						// a percentage, with a lower bound on 20%
				    height = Math.round(num / maxNum * 80 + 20);
				    
			      if (xcurrent < xwish)
			      {
			      	var color = '#a93232';
			      	var span = '';
			      }
			      else if (xcurrent == xwish)
			      {
				      var color = '#e0c100';
				      var span = '';
			      }
			      else if (xcurrent > xwish)
			      {
			      	switch (num)
			      	{
				      	case 1:
				      		var color = '#4f824f';
				      	break;
				      	case 2:
				      		var color = '#477547';
				      	break;
				      	case 3:
				      		var color = '#436f43';
				      	break;
				      	case 4:
				      		var color = '#3d673d';
				      	break;
				      	case 5:
				      		var color = '#396039';
				      	break;
				      	case 6:
				      		var color = '#335833';
				      	break;
				      	case 7:
				      		var color = '#305330';
				      	break;
				      	default:
				      		var color = '#294929';
			      	}
				      var span = '<span class="badge badge-inverse">' + num + '</span>';
			      }
			      
			      if (xcurrent > xwish) {
			      	height = minHeight;
			      }
			      
			      style = 'height:' + height + 'px;' + 'background-color: ' + color + ';';
			      var actual = '<div class="bar" style="' + style + '" ' +
			              ' title="Huidig aantal beschikbaar: ' + num + ' personen">'+span+'</div>';
			      var item = {
			          'group': label,
			          'start': Math.round(data[i].start * 1000),
			          'end': Math.round(data[i].end * 1000),
			          'content': requirement + actual
			      };
			      ndata.push(item);
					}
			    
			    webpaige.config('south', ndata);  
		      //window.northndata = ndata;
		      //console.log('north: ', window.northndata); 
		  
				}
			); 
			
			
			
			
			
			
			
			
		  var trange = webpaige.config('trange');
		  
		  //console.log('group timeline start:', trange.start);
		  //console.log('group timeline end:', trange.end);
		  
		  
		  var options = {
		      "width":  "100%",
		      "height": 'auto',
		      "style": "box",
		      'selectable': true,
		      'editable': false,
		      'groupsWidth': '100px',
		      'eventMarginAxis': 0,
        'min': new Date(trange.start),                 // lower limit of visible range
        'max': new Date(trange.end),   
	        //'min': new Date(2012, 0, 1),                 // lower limit of visible range
	        //'max': new Date(2012, 11, 31),               // upper limit of visible range
	        //'min': trange.start,                 // lower limit of visible range
	        //'max': trange.end,               // upper limit of visible range
	        'intervalMin': 1000 * 60 * 60 * 24,          // one day in milliseconds
	        'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2,   // about three months in milliseconds,
        'showMajorLabels': false,
        'showMinorLabels': false
		  };
		  timeline2 = new links.Timeline(document.getElementById('groupTimeline'));
		  google.visualization.events.addListener(timeline2, 'rangechange', onRangeChanged2);
			
		  timeline2.draw(ndata, options);
		  
		  //console.log('north second: ', webpaige.config('north'));
		  //timeline2.draw(webpaige.config('north'), options);
		  
		  //var trange = webpaige.config('trange');
		  timeline2.setVisibleChartRange(trange.start, trange.end);
		  
		  //console.log('grp :', JSON.stringify(trange));
  
		}
	); 
}

function getMemberSlots(uuid)
{
	webpaige.con(
		options = {
			path: '/network/'+uuid+'/members',
			loading: 'De groep lidden beschikbaarheiden worden opgeladen..',
			label: uuid
			,session: session.getSession()	
		},
		function(data, label)
	  {  
			timeline_data3 = new google.visualization.DataTable();
			timeline_data3.addColumn('datetime', 'start');
			timeline_data3.addColumn('datetime', 'end');
			timeline_data3.addColumn('string', 'content');
			timeline_data3.addColumn('string', 'group');
	  	//var members = JSON.parse(data);
	  	var members = data;
	  	for (var i in members)
	  	{
				renderMemberSlots(members[i], members[i].name);
	  	}
	  	
		  var trange = webpaige.config('trange');
		  
		  //console.log('members timeline start:', trange.start);
		  //console.log('members timeline end:', trange.end);
		  
		  if (webpaige.getRole() == 1)
		  {
				var options = {
			    'selectable': true,
			    'editable': true,
			    'snapEvents': false,
			    'groupChangeable': false,
	        'min': new Date(trange.start),                 // lower limit of visible range
	        'max': new Date(trange.end),   
	        //'min': new Date(2012, 0, 1),                 // lower limit of visible range
	        //'max': new Date(2012, 11, 31),               // upper limit of visible range
	        //'min': trange.start,                 // lower limit of visible range
	        //'max': trange.end,               // upper limit of visible range
	        'intervalMin': 1000 * 60 * 60 * 24,          // one day in milliseconds
	        'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2,   // about three months in milliseconds,
        'showMajorLabels': false,
        'showMinorLabels': false
			  };			  
		  }
		  else
		  {
				var options = {
			    'selectable': false,
			    'editable': false,
			    'snapEvents': false,
			    'groupChangeable': false,
	        'min': new Date(trange.start),                 // lower limit of visible range
	        'max': new Date(trange.end),   
	        //'min': new Date(2012, 0, 1),                 // lower limit of visible range
	        //'max': new Date(2012, 11, 31),               // upper limit of visible range
	        //'min': trange.start,                 // lower limit of visible range
	        //'max': trange.end,               // upper limit of visible range
	        'intervalMin': 1000 * 60 * 60 * 24,          // one day in milliseconds
	        'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2,   // about three months in milliseconds,
        'showMajorLabels': false,
        'showMinorLabels': false
			  };	
		  }
			
			timeline3.draw(timeline_data3, options);
		  //var trange = webpaige.config('trange');
		  timeline3.setVisibleChartRange(trange.start, trange.end);
		  
		  //console.log('mem :', JSON.stringify(trange));
		}
	);
}

function renderMemberSlots(member, name)
{  
	webpaige.con(
		options = {
			path: '/askatars/'+member.uuid+'/slots?'+window.range,
			loading: 'De beschiebaarheiden worden opgeladen..',
			label: member
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  
	  	var slots = data; 
				timeline3.addItem({
					'start':new Date(0),
					'end':new Date(0),
					'content':'available',
					'group': '<span style="display:none;">'+label.uuid+':true</span>' + label.name + ' <div style="display:none;">b</div>(Wekelijkse terugkerend)'
				});
				timeline3.addItem({
					'start':new Date(0),
					'end':new Date(0),
					'content':'available',
					'group': '<span style="display:none;">'+label.uuid+':false</span>' + label.name + ' <div style="display:none;">a</div>(Planning)'
				});
				
			for (var i in slots)
			{
			  var content = colorState(slots[i].text);
				timeline3.addItem({
					'start':new Date(slots[i].start * 1000),
					'end':new Date(slots[i].end * 1000),
					'content':content,
					'group':slots[i].recursive ? '<span style="display:none;">'+label.uuid+':true</span>' + label.name + ' <div style="display:none;">b</div>(Wekelijkse terugkerend)' : '<span style="display:none;">'+label.uuid+':false</span>' + label.name + ' <div style="display:none;">a</div>(Planning)'
				});
			}  
		}
	);     
}

/*
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
*/




// Slot makeups
function colorState(state)
{
  var content = '?';
  if (state == 'com.ask-cs.State.Available') return '<div class="available">' + state + '</div>';
  if (state == 'com.ask-cs.State.KNRM.BeschikbaarNoord') return '<div class="availableN">' + state + '</div>';
  if (state == 'com.ask-cs.State.KNRM.BeschikbaarZuid') return '<div class="availableS">' + state + '</div>';
  if (state == 'com.ask-cs.State.Unavailable') return '<div class="unavailable">' + state + '</div>';
  if (state == 'com.ask-cs.State.KNRM.SchipperVanDienst') return '<div class="schipper">' + state + '</div>';
}

function timeline_helper_state2html(state)
{
  var state_map = {
	    'ask.state.1': ['com.ask-cs.State.Available', 'green'],
	    'ask.state.2': ['com.ask-cs.State.KNRM.BeschikbaarNoord', 'green'],
	    'ask.state.3': ['com.ask-cs.State.KNRM.BeschikbaarZuid', 'green'],
	    'ask.state.4': ['com.ask-cs.State.Unavailable', 'red'],
	    'ask.state.5': ['com.ask-cs.State.KNRM.SchipperVanDienst', 'yellow']
	 };
  var content = '?';
  if (state_map[state])
  	return '<div style="background-color:' + state_map[state][1] + '">' + state_map[state][3] + '</div>';
}

function timeline_helper_html2state(content)
{
  var state_map = {
	    'ask.state.1': ['com.ask-cs.State.Available', 'green'],
	    'ask.state.2': ['com.ask-cs.State.KNRM.BeschikbaarNoord', 'green'],
	    'ask.state.3': ['com.ask-cs.State.KNRM.BeschikbaarZuid', 'green'],
	    'ask.state.4': ['com.ask-cs.State.Unavailable', 'red'],
	    'ask.state.5': ['com.ask-cs.State.KNRM.SchipperVanDienst', 'yellow']
	 };
  var state = content.split('>')[1].split('<')[0];
  //reverse map search..
  for (var i in state_map)
  {
    if (state == state_map[i][0]) return i;
  }
  return state;
}

function html2state(content)
{
  return content.split('>')[1].split('<')[0];
}

function trimSpan(content)
{
  return content.split('n>')[1];
}

function timeline_helper_html2state2(content)
{
  var state_map = {
	    'ask.state.1': ['com.ask-cs.State.Available', 'green'],
	    'ask.state.2': ['com.ask-cs.State.KNRM.BeschikbaarNoord', 'green'],
	    'ask.state.3': ['com.ask-cs.State.KNRM.BeschikbaarZuid', 'green'],
	    'ask.state.4': ['com.ask-cs.State.Unavailable', 'red'],
	    'ask.state.5': ['com.ask-cs.State.KNRM.SchipperVanDienst', 'yellow']
	 };
  var state = content.split('>')[1].split('<')[0];
  //reverse map search..
  for (var i in state_map)
  {
    if (state == state_map[i][0]) return state_map[i][0];
  }
  return state;
}
    
    
    
        

// Group list producers
function renderGroupsList()
{			
	if (webpaige.getRole() < 3)
	{
		webpaige.con(
			options = {
				path: '/network',
				loading: 'De groep informatie wordt opgeladen..',
				label: 'groups'
				,session: session.getSession()	
			},
			function(data, label)
		  {
			  /*
		  	data.sort(function(a,b)
		  	{
			    if (a.name == b.name) { return 0; }
			    if (a.name > b.name)
			    {
			    	return 1;
			    }
			    else
			    {
			    	return -1;
			    }		  		
		  	});
		  	*/
		  	 
			  for(var i in data)
			  {
		  		$('#groupsList').append('<option value="'+data[i].uuid+'">'+data[i].name+'</option>'); 	    
			  }
			}
		);
	}
	else
	{
		webpaige.con(
			options = {
				path: '/parent',
				loading: 'Parent groep informatie wordt opgeladen..',
				label: 'parent group: '
				,session: session.getSession()	
			},
			function(data, label)
		  {
			  //var data = JSON.parse(data);	
		  	for (var i in data)
		  	{	  		
		  		$('#groupsList').append('<option value="'+data[i].uuid+'">'+data[i].name+'</option>'); 		  	
		  	}
			}
		); 
	}			
					
/*
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
		  	$('#groupsList').append('<option value="'+data[i].uuid+'">'+data[i].name+'</option>');		    
		  }
		}
	);
*/
	
}

/*
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
*/




function goToday()
{
  var trange = webpaige.config('treset');
  
  window.range =	'start=' + trange.bstart + 
  								'&end=' + trange.bend;
  
  webpaige.config('trange', trange);
  
	var label = {
	 gname : webpaige.config('gname'),
	 guuid : webpaige.config('guuid')
	};
	getSlots();
	getGroupSlots(label.guuid, label.gname);
	getMemberSlots(label.guuid);
  								
  //timeline.setVisibleChartRange(trange.start, trange.end);
  //timeline2.setVisibleChartRange(trange.start, trange.end);
  //timeline3.setVisibleChartRange(trange.start, trange.end);
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
	var otrange = webpaige.config('trange');
	
	var trange = {};
	
  trange.bend = otrange.bstart;
  trange.bstart = (trange.bend - 86400 * 7 * 2);	
  
  trange.end = otrange.start;
  trange.start = new Date(otrange.start).addWeeks(-2);
  
  window.range =	'start=' + trange.bstart + 
  								'&end=' + trange.bend;
  
  webpaige.config('trange', trange);
  
	var label = {
	 gname : webpaige.config('gname'),
	 guuid : webpaige.config('guuid')
	};
	getSlots();
	getGroupSlots(label.guuid, label.gname);
	getMemberSlots(label.guuid);
}

function timelineMoveRight()
{			
	var otrange = webpaige.config('trange');
	
	var trange = {};
	
  trange.bstart = otrange.bend;
  trange.bend = (trange.bstart + 86400 * 7 * 2);	
  
  trange.start = otrange.end;
  trange.end = new Date(otrange.end).addWeeks(2);
  
  window.range =	'start=' + trange.bstart + 
  								'&end=' + trange.bend;
  
  webpaige.config('trange', trange);
  
	var label = {
	 gname : webpaige.config('gname'),
	 guuid : webpaige.config('guuid')
	};
	getSlots();
	getGroupSlots(label.guuid, label.gname);
	getMemberSlots(label.guuid);
}






