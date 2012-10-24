/* (function(){ */
	//'use strict';

window.addEventListener( 'load', windowInit, false );

function windowInit()
{
 	pageInit('settings', 'true');	

 	renderGroupsList();
  
  var guuid = webpaige.config('firstGroup');
  wishesTimelineInit(guuid);  
  
  $("#groupsList").change(function()
  {
		var guuid = $(this).find(":selected").val();
	  wishesTimelineInit(guuid);  
	});
 	
}
    

	
var session = new ask.session();
var timeline;
var timeline_selected = null;




// Timneline initators
function wishesTimelineInit(guuid)
{
  timeline_data = [];
  var options = {
  	'groupsWidth': '100px'
  };
  timeline = new links.Timeline(document.getElementById('wishesTimeline'));
  // Add event listeners
/*
  google.visualization.events.addListener(timeline, 'edit', 	timelineOnEdit);
  google.visualization.events.addListener(timeline, 'add', 		timelineOnAdd);
  google.visualization.events.addListener(timeline, 'delete', timelineOnDelete);
  google.visualization.events.addListener(timeline, 'change', timelineOnChange);
  google.visualization.events.addListener(timeline, 'select', timelineOnSelect);
  google.visualization.events.addListener(timeline, 'rangechange', onRangeChanged1);
*/
  
  //timeline.setVisibleChartRange( new Date(2012,05,10),new Date(2012,05,20) ); 
  
  var lab = new Object();
  lab.start = new Date(0);
  lab.content = '';
  lab.group = '<div>Plan</div>';
  timeline.addItem(lab);
  timeline.addGroup("<div>Plan</div>");
  timeline.draw(timeline_data, options);
  
  getWishes(guuid);
}

function getWishes(guuid)
{
  var now = parseInt((new Date()).getTime() / 1000);
	var resources = JSON.parse(webpaige.get('resources'));
  var range =	'start=' + (now - 86400 * 7 * 4 * 1) + 
  						'&end=' + (now + 86400 * 7 * 4 * 1);  
  						
  // console.log('/calc_planning/'+guuid+'?'+range);						
  						
	webpaige.con(
		options = {
			path: '/network/'+guuid+'/wish?'+range,
			//path: '/parent/availability?'+range,
			loading: 'Getting group aggregiated slots..',
			label: 'slots'
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
			  	guuid
			  ]
			  );
			}   
		        
			//var options = {};
			timeline.draw(timeline_data, options); 
		}
	); 
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
		  	(i == 0) ? webpaige.config('firstGroup', data[i].uuid) : null;	  	
		  	
		  	$('#groupsList').append('<option value="'+data[i].uuid+'">'+data[i].name+'</option>');		    
		  }
		}
	);
}
	
/* })(); */