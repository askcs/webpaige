'use strict';
/* Dashboard controller */

function dashboard($scope)
{
	var _slots = JSON.parse('[{"count":0,"end":1350597600,"recursive":true,"start":1350573110,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1350684000,"recursive":true,"start":1350597600,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"availability","wish":0},{"count":0,"end":1350770400,"recursive":true,"start":1350684000,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1350943200,"recursive":true,"start":1350770400,"text":"com.ask-cs.State.Available","type":"availability","wish":0},{"count":0,"end":1351029600,"recursive":true,"start":1350943200,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351116000,"recursive":true,"start":1351029600,"text":"com.ask-cs.State.KNRM.BeschikbaarNoord","type":"availability","wish":0},{"count":0,"end":1351202400,"recursive":true,"start":1351116000,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351288800,"recursive":true,"start":1351202400,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"availability","wish":0},{"count":0,"end":1351375200,"recursive":true,"start":1351288800,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351551600,"recursive":true,"start":1351375200,"text":"com.ask-cs.State.Available","type":"availability","wish":0},{"count":0,"end":1351638000,"recursive":true,"start":1351551600,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351724400,"recursive":true,"start":1351638000,"text":"com.ask-cs.State.KNRM.BeschikbaarNoord","type":"availability","wish":0},{"count":0,"end":1351782710,"recursive":true,"start":1351724400,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1350597600,"recursive":false,"start":1350511200,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"","wish":0},{"count":0,"end":1350630420,"recursive":false,"start":1350597600,"text":"com.ask-cs.State.Available","type":"","wish":0},{"count":0,"end":1350640800,"recursive":false,"start":1350630420,"text":"com.ask-cs.State.KNRM.BeschikbaarNoord","type":"","wish":0},{"count":0,"end":1350680400,"recursive":false,"start":1350640800,"text":"com.ask-cs.State.Available","type":"","wish":0},{"count":0,"end":1350684000,"recursive":false,"start":1350680400,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"","wish":0},{"count":0,"end":1350770400,"recursive":false,"start":1350684000,"text":"com.ask-cs.State.Unavailable","type":"","wish":0},{"count":0,"end":1350856800,"recursive":false,"start":1350770400,"text":"com.ask-cs.State.Available","type":"","wish":0}]');
	
	var slots = $scope.slots = _slots;
	
	var _networks = JSON.parse('[{"name":"Schippers","resources":{"id":"f609041a-69b6-1030-a3ab-005056bc7e66","name":"Schippers"},"serviceCount":-1,"serviceID":"","type":"","uuid":"f609041a-69b6-1030-a3ab-005056bc7e66"},{"name":"Opstappers","resources":{"id":"a2408ffc-69b5-1030-a3ab-005056bc7e66","name":"Opstappers"},"serviceCount":-1,"serviceID":"","type":"","uuid":"a2408ffc-69b5-1030-a3ab-005056bc7e66"}]');
	
	var networks = $scope.networks = _networks;
	
	
	
	var trange = '{"bstart":1350630639,"bend":1351840239,"start":"2012-10-20T22:00:00.000Z","end":"2012-10-30T23:00:00.000Z"}';
	
	var treset = '{"bstart":1350630639,"bend":1351840239,"start":"2012-10-20T22:00:00.000Z","end":"2012-10-30T23:00:00.000Z"}';
	
	var resources = '{"askatar":null,"askPass":"eadeb77d8fba90b42b32b7de13e8aaa6","PostZip":null,"PhoneAddress":"+31627033823","Identification Data":"apptestknrm","settingsPaige":"{\"general\":{\"profile\":{\"uuid\":\"apptestknrm\",\"name\":\"apptest knrm\",\"mail\":{\"apptestknrm\":\"apptestknrm\"},\"phone\":{\"0123456789\":\"0123456789\",\"9876543210\":\"9876543210\"}},\"socialmedia\":{\"facebook\":{},\"google\":{\"authOK\":\"false\"},\"linkedin\":{},\"twitter\":{},\"yahoo\":{},\"youtube\":{}},\"energy\":\"Eco\",\"language\":\"English\"},\"appointment\":{\"c8d3ed60-8c79-4fb7-aeee-03ca45a57ea2\":{\"days\":{},\"time_from\":\"1340834400\",\"time_to\":\"1340834400\"}},\"privacy\":{\"text\":\"text\"},\"states\":{\"share\":{\"availability\":\"None\",\"activity\":\"none\",\"mood\":\"none\",\"connectedness\":\"none\",\"location\":\"none\"},\"homepage\":{\"availability\":true,\"activity\":true,\"mood\":true,\"connectedness\":true,\"location\":true}},\"about\":{\"version\":\"0.1.3\",\"releasedate\":\"2012/07/17\"}}","C2DMKey":"APA91bGvLs90vJcNoE-yqLGM2a_x1px5n3MrZ1aeeKaf-A5sm-w3l7NLO74IybdEsDhipaXoVEainC8_A_5QODXZG-3njkU7SUp9n3iz3t4eKrmUilk74qAPOmzh8vES3TpMHqEBwDUgKQcx4UbR_8ULFdBJzL7euA","PostAddress":null,"PostCity":null,"name":"apptest knrm","EmailAddress":"dferro@ask-cs.com","role":"1","uuid":"apptestknrm"}';
 	
  //var trange = webpaige.config('trange');
  window.range =	'start=' + trange.bstart + 
  								'&end=' + trange.bend;
  								
  
  
  //timelineInit();
  
  
  //var timeline;
  
  
/*
	function timelineInit(slots, resources, trange)
	{
*/
	  timeline_data = [];
	  timeline = new links.Timeline(document.getElementById('mytimeline'));
	  // Add event listeners
	  google.visualization.events.addListener(timeline, 'edit', 	timelineOnEdit);
	  google.visualization.events.addListener(timeline, 'add', 		timelineOnAdd);
	  google.visualization.events.addListener(timeline, 'delete', timelineOnDelete);
	  google.visualization.events.addListener(timeline, 'change', timelineOnChange);
	  google.visualization.events.addListener(timeline, 'select', timelineOnSelect);
	  google.visualization.events.addListener(timeline, 'rangechange', onRangeChanged1);
	  
	  //getSlots();
  	//var slots = data;  
		timeline_data = new google.visualization.DataTable();
		timeline_data.addColumn('datetime', 'start');
		timeline_data.addColumn('datetime', 'end');
		timeline_data.addColumn('string', 'content');
		timeline_data.addColumn('string', 'group');
		for (var i in slots)
		{
		
			//var resources = JSON.parse(webpaige.get('resources'));
		
		  var content = colorState(slots[i].text);
		  timeline_data.addRow([
		  	new Date(slots[i].start * 1000), 
		  	new Date(slots[i].end * 1000), 
		  	content, 
		  	slots[i].recursive ? '<span style="display:none;">b</span>Wekelijkse terugkerend<span style="display:none;">'+resources.uuid+':true</span>' : '<span style="display:none;">a</span>Planning<span style="display:none;">'+resources.uuid+':false</span>'
		  ]);
		}      
		
		
	  //var trange = webpaige.config('trange');
	  
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
      'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2   // about three months in milliseconds
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
			  
/* 	} */
	
/*
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
	        'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2   // about three months in milliseconds
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
*/
	
	
	
}
dashboard.$inject = ['$scope'];