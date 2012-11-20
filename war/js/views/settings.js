
window.addEventListener( 'load', windowInit, false );

function windowInit()
{
 	pageInit('settings', 'true');	

 	renderGroupsList();
  
  $('#from').datetimepicker();
  $('#till').datetimepicker();
  $('#efrom').datetimepicker();
  $('#etill').datetimepicker();
  
  wishesTimelineInit(); 

		var local = {
			title: 'settings_title',
			statics: ['settings_today', 'settings_new_wish', 'settings_group', 'settings_from', 'settings_till', 'settings_wish', 'settings_cancel', 'settings_save_wish', 'settings_edit_wish', 'settings_settings']		
		}
		webpaige.i18n(local); 
 	
}
    

	
var session = new ask.session();
var timeline;
var timeline_selected = null;


function wishSubmit()
{
  $('#newWish').modal('hide');
  
  var group = $('#groupsList option:selected').val();
  
  var from = $('#from').val();
  var till = $('#till').val();
  
  var wish = $('#wish').val();
  
  var from = Date.parse(from, "dd-MMM-yyyy HH:mm");
  var from = from.getTime();
  
  var till = Date.parse(till, "dd-MMM-yyyy HH:mm");
  var till = till.getTime();
  
  addWish(from, till, wish, group);
  
  $('#newWishForm')[0].reset();
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





function editWishModal(start, end, group, wish)
{
  $('#editWish').modal('show');
  $('#editWish span#groupName').html(group);  
  start = new Date(start.getTime());
  start = start.toString("dd-MMM-yyyy HH:mm");
  $('#editWish #efrom').val(start);
  end = new Date(end.getTime());
  end = end.toString("dd-MMM-yyyy HH:mm");
  $('#editWish #etill').val(end);
  $('#editWish #ewish').val(wish);
}



function editWishSubmit()
{
  $('#editWish').modal('hide');
  var group = $('#editWish span#groupName').html();  
  var start = $('#editWish #efrom').val();
  var end = $('#editWish #etill').val();
  var wish = $('#editWish #ewish').val();
  
  start = Date.parse(start, "dd-MMM-yyyy HH:mm");
  start = start.getTime();
  
  end = Date.parse(end, "dd-MMM-yyyy HH:mm");
  end = end.getTime();
  
	var groups = JSON.parse(webpaige.get('groups'));
  
  for (var i in groups)
  {
	  if (groups[i].name == group)
	  {
		  var guuid = groups[i].uuid;
	  }	  
  }
  
  addWish(start, end, wish, guuid);
}



function addWish(from, till, wish, group)
{
  var body = 	'{"end":' + (till / 1000) + 
  						',"start":' + (from / 1000) + 
  						',"wish":"' + wish + '"}';
	webpaige.con(
		options = {
			type: 'put',
			path: '/network/'+group+'/wish',
			json: body,
			loading: 'Nieuwe beschiekbaarheid wordt toegevoegd..'
			,session: session.getSession()	
		},
		function(data)
	  {  
			getWishes();
		}
	); 
} 



// Timneline initators
function wishesTimelineInit()
{
  timeline_data = [];
  var options = { 
  };
  timeline = new links.Timeline(document.getElementById('wishesTimeline'));
  
  // Add event listeners
  google.visualization.events.addListener(timeline, 'edit', 	timelineOnEdit);
  google.visualization.events.addListener(timeline, 'add', 		timelineOnAdd);
  google.visualization.events.addListener(timeline, 'delete', timelineOnDelete);
  google.visualization.events.addListener(timeline, 'change', timelineOnChange);
  google.visualization.events.addListener(timeline, 'select', timelineOnSelect);
  
  getWishes();
}

function getWishes()
{
	
  var now = parseInt((new Date()).getTime() / 1000);
  var range =	'start=' + (now - 86400 * 7 * 4 * 4) + 
  						'&end=' + (now + 86400 * 7 * 4 * 4);  
	
	timeline_data = new google.visualization.DataTable();
	timeline_data.addColumn('datetime', 'start');
	timeline_data.addColumn('datetime', 'end');
	timeline_data.addColumn('string', 'content');
	timeline_data.addColumn('string', 'group');
						 						
	webpaige.con(
		options = {
			path: '/network',
			loading: 'Groepen worden opgeladen..',
			label: 'groups'
			,session: session.getSession()	
		},
		function(data, label)
	  { 		
		  for(var i in data)
		  { 						
				webpaige.con(
					options = {
						path: '/network/'+data[i].uuid+'/wish?'+range,
						loading: data[i].name+' beschiekbaarheid wordt opgeladen..',
						label: data[i].name
						,session: session.getSession()	
					},
					function(data, label)
				  {
						for (var i in data)
						{
						  var content = '<div class="wishslot c-' + data[i].count + '">' + data[i].count + '</div>';
						  timeline_data.addRow([
						  	new Date(data[i].start * 1000), 
						  	new Date(data[i].end * 1000), 
						  	content, 
						  	label
						  ]
						  );
						}        
					  var options = {
					      'selectable': true,
					      'editable': true,
					      'groupsWidth': '100px'
					  };
						timeline.draw(timeline_data, options); 
					}
				); 
		  }
		}
	);
	
	
}

















// Timeline events
function timelineOnAdd()
{
}

function timelineOnEdit()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var item = timeline.getItem(row);
  var wish = timeline_data.getValue(row, 2).split('>')[1].split('<')[0];
  
  editWishModal(item.start, item.end, item.group, wish);
}

function timelineOnDelete()
{
	timeline.cancelChange();
}

function timelineOnSelect()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  timeline_selected = timeline.getItem(row);
}

function timelineOnChange()
{
	timeline.cancelChange();
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
	  	webpaige.set(label, JSON.stringify(data)); 
		  for(var i in data)
		  {  
		  	$('#groupsList').append('<option value="'+data[i].uuid+'">'+data[i].name+'</option>');		    
		  }
		}
	);
}