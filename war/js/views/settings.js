/* (function(){ */
	//'use strict';

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
 	
}
    

	
var session = new ask.session();
var timeline;
var timeline_selected = null;



// Submitters
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
  //console.log(from, till, wish, group);
  
  $('#newWishForm')[0].reset();
}



function editPlanSubmit()
{
  $('#editEvent').modal('hide');
  
  var enewType = $('input#eplanningType[name="eplanningType"]:checked').val();
  var enewFrom = $('#eplanningFrom').val();
  var enewTill = $('#eplanningTill').val();
  var enewReoccuring = $('input#eplanningReoccuring:checkbox:checked').val();
  //var newAllDay = $('input#planningAllDay:checkbox:checked').val();
  
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






function addWish(from, till, wish, group)
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



// Timneline initators
function wishesTimelineInit()
{
  timeline_data = [];
  var options = {
  	// 'groupsWidth': '100px'
  };
  timeline = new links.Timeline(document.getElementById('wishesTimeline'));
  
  // Add event listeners
  google.visualization.events.addListener(timeline, 'edit', 	timelineOnEdit);
  google.visualization.events.addListener(timeline, 'add', 		timelineOnAdd);
  google.visualization.events.addListener(timeline, 'delete', timelineOnDelete);
  google.visualization.events.addListener(timeline, 'change', timelineOnChange);
  google.visualization.events.addListener(timeline, 'select', timelineOnSelect);
  
/*
  var lab = new Object();
  lab.start = new Date(0);
  lab.content = '';
  lab.group = '<div>Plan</div>';
  timeline.addItem(lab);
  timeline.addGroup("<div>Plan</div>");
  timeline.draw(timeline_data, options);
*/
  
  getWishes();
}

function getWishes()
{
	
  var now = parseInt((new Date()).getTime() / 1000);
	//var resources = JSON.parse(webpaige.get('resources'));
  var range =	'start=' + (now - 86400 * 7 * 4 * 1) + 
  						'&end=' + (now + 86400 * 7 * 4 * 1);  
			  						
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
		  	
		  	var gname = data[i].name;					
			  						
				webpaige.con(
					options = {
						path: '/network/'+data[i].uuid+'/wish?'+range,
						//path: '/parent/availability?'+range,
						loading: 'Getting '+data[i].name+' wishes..',
						label: 'wishes'
						,session: session.getSession()	
					},
					function(data, label)
				  {
			
				  	//var slots = JSON.parse(data); 
						timeline_data = new google.visualization.DataTable();
						
						timeline_data.addColumn('datetime', 'start');
						timeline_data.addColumn('datetime', 'end');
						timeline_data.addColumn('string', 'content');
						timeline_data.addColumn('string', 'groups');
						
						for (var i in data)
						{
						  var content = '<div style="color: green;">' + data[i].count + '</div>';
						  timeline_data.addRow([
						  	new Date(data[i].start * 1000), 
						  	new Date(data[i].end * 1000), 
						  	content, 
						  	gname
						  ]
						  );
						}   
					        
						//var options = {};
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
  var curItem = timeline.getItem(row);
  var content = timeline_data.getValue(row, 2);
  
  //console.log(timeline_helper_html2state(content));
  
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
		  for(var i in data)
		  {  
		  	$('#groupsList').append('<option value="'+data[i].uuid+'">'+data[i].name+'</option>');		    
		  }
		}
	);
}
	
/* })(); */