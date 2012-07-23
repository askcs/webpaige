$(document).ready(function()
{
 	pageInit('dashboard', 'true');

  //checkLogin();
  //loadUserInfo();
  
  $('#messages').bxSlider(
  {
    auto: false,
    pager: true,
    mode: 'fade'
    //controls: false
  });
  
  $('#planningFrom').datetimepicker();
  $('#planningTill').datetimepicker();
  $('#eplanningFrom').datetimepicker();
  $('#eplanningTill').datetimepicker();
  
  $("#planningAllDay").click(function()
  {
    if ($('input#planningAllDay:checkbox:checked').val() == "true")
    {
      $('#plTill').hide();
    }
    else
    {
      $('#plTill').show();
    }
  });
  
  $('#editPlanSubmitter').click(function()
  {
    $('#editEvent').modal('hide');
    
    var enewType = $('input#eplanningType[name="eplanningType"]:checked').val();
    var enewFrom = $('#eplanningFrom').val();
    var enewTill = $('#eplanningTill').val();
    var enewReoccuring = $('input#eplanningReoccuring:checkbox:checked').val();
    //var newAllDay 			= $('input#planningAllDay:checkbox:checked').val();
    
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

		ask_slots_modal_update();
		
    $('#editEventForm')[0].reset();
  });
  
  
  $('#deletePlanBtn').click(function()
  {
    $('#editEvent').modal('hide');
    ask_slots_modal_delete(oldslot.from, oldslot.till, oldslot.reoc, oldslot.type);
    $('#editEventForm')[0].reset();
  });
  
  
  $('#planSubmitter').click(function()
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
    
    ask_slots_add(planningFrom, planningTill, planningReoccuring, planningType);
    
    $('#newEventForm')[0].reset();
  });
  
  $('#tmlTodayBtn').click(
  function()
  {
  	jos_timeline();
  });
  
  $('#tmlZoomInBtn').click(
  function()
  {
  	timelineZoomIn();
  });
  
  $('#tmlZoomOutBtn').click(
  function()
  {
  	timelineZoomOut();
  });
  
  $('#tmlMoveLeftBtn').click(
  function()
  {
  	timelineMoveLeft();
  });
  
  $('#tmlMoveRightBtn').click(
  function()
  {
  	timelineMoveRight();
  });
  
  var position = JSON.parse(webpaige.get('position'));
  var value = JSON.parse(position.value);
  renderPosition(value);
  
  var activity = JSON.parse(webpaige.get('activity'));
  renderActivity(activity);
  
  var location = JSON.parse(webpaige.get('location'));
  renderLocation(location);
});




var session = new ask.session();




/*
var ncache = new ASKCache("Groups", '/network', null, 'uuid', session);
ncache.addRenderer(
	function(data)
	{
		console.log('Groups ', data);
	}
);
*/
	

/*
function checkLogin() {
	if (!localStorage.getItem('loggedIn')) {
			document.location = "login.html";
	}
}
*/
            
            
            

function showLogin()
{
  document.location = 'login.html';
}

function loadUserInfo()
{
  $.ajax(
  {
    url: host + '/resources',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-SESSION_ID', session.getSession());
      return true;
    },
    contentType: 'application/json',
    xhrFields: { withCredentials: true },
    success: function(jsonData) {
      renderInfo(jsonData);
    },
    error: function() {}
  });
}

function renderInfo(user)
{
  console.log(user);
  localStorage.setItem('user', JSON.stringify(user));
  $(".d_username").html(user.name);
  //console.log('Session ID: ', session.getSession());
  //console.log('Sense Session ID: ', localStorage.getItem('senseSessionId'));
  
  //loadSenseSensors();
}






function renderPosition(data)
{
  $(".latitude").html(data.latitude);
  $(".longitude").html(data.longitude);
  $(".provider").html(data.provider);
  $(".accuracy").html(data.accuracy);
  
  
  //date = new Date(window.latest * 1000);
  var config = JSON.parse(webpaige.get('config'));
  date = new Date(config.latestPosition * 1000);
  
  
  $(".positionDate").html(date.toString("dd-MMM-yyyy HH:mm"));
  var mapFrame = "<iframe id=\"widgetLocation\" src=\"http://localhost:8888/widget_location.html?latitude=" + data.latitude + "&longitude=" + data.longitude + "&provider=" + data.provider + "&accuracy=" + data.accuracy + "&date=" + date.toString("dd-MMM-yyyy HH:mm") + "\"></iframe>";
  $("#mapFrame").html(mapFrame);
  
}



function renderLocation(data)
{
  var location = data.pop();
  $("#location").html(location.value);
  var date = new Date(location.date * 1000);
  $("#locationDate").html(date.toString("dd-MMM-yyyy HH:mm"));
}


function renderActivity(data)
{
  var activity = data.pop();
  var date = new Date(activity.date * 1000);
  $("#activity").html(activity.value);
  $("#activityDate").html(date.toString("dd-MMM-yyyy HH:mm"));
}





















/**
 * Split given dataset in two datasets. The first
 * @param {Object[]} data     Array with objects, each object has
 *                            a parameter date and value
 * @param {Number} treshold   Threshold value
 * @return {Object} splitted  An object containing data sets 'lower'
 *                           'threshold', and 'upper'
 */
function dataSplit(data, threshold) {
    var upper = [];
    var lower = [];
    var thres = [];

    var prevIsLower = undefined;
    for (var i = 0, l = data.length; i < l; i++) {
        var d = data[i];
        var isLower = (d.value < threshold);
        if (isLower) {
            lower.push({ 'date': new Date(d.date), 'value': d.value});
        }
        else {
            upper.push({'date': new Date(d.date), 'value': d.value});
        }
        thres.push({'date': new Date(d.date), 'value': threshold});

        if (i > 0 && prevIsLower != isLower) {
            // change from lower to upper or vice versa
            var dPrev = data[i - 1];
            var fraction = (threshold - dPrev.value) / (d.value - dPrev.value);
            var dateAvg = new Date(Math.round(
                    dPrev.date.valueOf() +
                    (d.date.valueOf() - dPrev.date.valueOf()) * fraction));
            var valueAvg = dPrev.value + (d.value - dPrev.value) * fraction;

            if (prevIsLower) {
                lower.push({'date': new Date(dateAvg), 'value': valueAvg});
                lower.push({'date': new Date(dateAvg), 'value': undefined});
                upper.push({'date': new Date(dateAvg), 'value': undefined});
                upper.push({'date': new Date(dateAvg), 'value': valueAvg});
            }
            else {
                upper.push({'date': new Date(dateAvg), 'value': valueAvg});
                upper.push({'date': new Date(dateAvg), 'value': undefined});
                lower.push({'date': new Date(dateAvg), 'value': undefined});
                lower.push({'date': new Date(dateAvg), 'value': valueAvg});
            }
        }
        prevIsLower = isLower;
    }

    return {
        "upper": upper,
        "lower": lower,
        "threshold": thres
    };
}

function drawVisualization() {
    // Create and populate a data table.
    var graphData = [];

    function functionA(x) {
        return Math.sin(x / 10) * Math.cos(x / 5) * 50;
    }

    // create a set of dates
    var d = new Date(2010, 9, 23, 20, 0, 0);
    for (var i = 0; i < 100; i++) {
        graphData.push({
            'date': new Date(d),
            'value': functionA(i)
        });
        d.setMinutes(d.getMinutes() + 1);
    }

    var threshold = 4;
    var splittedData = dataSplit(graphData, threshold);

    var data = [
        {"label": "Threshold", "data" : splittedData.threshold},
        {"label": "Upper", "data" : splittedData.upper},
        {"label": "Lower", "data" : splittedData.lower}
    ];

    // specify options
    var options = {
        width:  "100%",
        height: "220px",
        lines: [
            {color: "#FF9900", width: 1}, // orange
            {color: "#109618", width: 3}, // green
            {color: "#DC3912", width: 3}  // red
        ]
    };

    // Instantiate our graph object.
    window.graph = new links.Graph(document.getElementById('mygraph'));

    // Draw our graph with the created data and options
    window.graph.draw(data, options);
    
}
        
        
        
        
        
        
        
        











function homePage_init()
{
/*
  var ask_session = session.getSession();
  
  if (ask_session == '')
  {
    //console.log("not logged in");
    return;
  }
*/
  
  //retrieve from db?
  global_update('stateMap', {
    'ask.state.12': ['meeting', '#77d'],
    'ask.state.13': ['nr13', 'red'],
    'ask.state.14': ['nr14', 'green']
  });
  
  jos_timeline();
}


var timeline;
var timeline_data = [];

function jos_timeline()
{
  timeline_data = [];
  
  // specify options
  var options = {
    'height': '172px'
  };
  
  timeline = new links.Timeline(document.getElementById('mytimeline'));
  
  // Add event listeners
  google.visualization.events.addListener(timeline, 'edit', 	timeline_onEdit);
  google.visualization.events.addListener(timeline, 'add', 		timeline_onAdd);
  google.visualization.events.addListener(timeline, 'delete', timeline_onDelete);
  google.visualization.events.addListener(timeline, 'change', timeline_onChange);
  google.visualization.events.addListener(timeline, 'select', timeline_onSelect);
  
    //google.visualization.events.addListener(timeline, 'timechange', onTimeChange);
    //google.visualization.events.addListener(timeline, 'rangechanged', onRangeChanged);
  
	/*
  var newStartDate = new Date(document.getElementById('startDate').value);
  var newEndDate = new Date(document.getElementById('endDate').value);
	*/
  timeline.setVisibleChartRange( new Date(2012,05,10),new Date(2012,05,20) ); 
      
	/* attach an event listener using the links events handler
    function onRangeChanged(properties) {
        console.log(properties);
    }
    links.events.addListener(timeline, 'rangechanged', onRangeChanged);
	*/
	
  var lab = new Object();
  lab.start = new Date(0);
  lab.content = '';
  lab.group = '<div>Plan</div>';
  timeline.addItem(lab);
  timeline.addGroup("<div>Plan</div>");
  timeline.draw(timeline_data, options);
  
	/*
	timeline_data.push({
	    'start': new Date(),
	    //'end': new Date(2012, 2, 1),  // end is optional
	    'content': 'created'
	    // Optional: a fourth parameter 'group'
    });
	timeline.draw(timeline_data, options);
	*/
	
  //add event listening
  global_register('location', timeline_locationEvent);
  
  //get us some timeslots
  ask_slots_getPlanning();
  
}

function timeline_locationEvent(data, prevData)
{
  //dont show initial event?
  if (!prevData) return;
  timeline_data.push({
    'start': new Date(),
    //'end': new Date(2012, 2, 1),  // end is optional
    'content': 'set location <br/>' + data[0] + " , " + data[1],
    // Optional: a fourth parameter 'group'
  });
  timeline.draw(timeline_data, options);
}

function timeline_onEdit()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var curItem = timeline.getItem(row);
  var content = timeline_data.getValue(row, 2);
  
  modal_editSlot(curItem.start, curItem.end, curItem.group, timeline_helper_html2state(content));
  
	/*
    var newContent = prompt("Enter content", content);
    if (newContent != undefined) {
		timeline_data.setValue(row, 2, newContent);
		}
    timeline.redraw();
	*/
  //timeline.cancelEdit(); //doesnt exist
}

function modal_editSlot(efrom, etill, ereoc, evalue)
{
  var eoldSlotValue;
  var eoldRecursive;
  var eoldSlotFrom;
  var eoldSlotTill;
  
  $('#editEvent').modal('show');
  
  if (evalue == 'available')
  {
    $('input#eplanningType')[0].checked = true;
  	eoldSlotValue = 'available';
  }
  else if (evalue == 'unavailable')
  {
    $('input#eplanningType')[1].checked = true;
  	eoldSlotValue = 'unavailable';
  }
  
  //$('input#planningType[name="planningType"]:checked').val(value);
  
  
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







function timeline_onAdd()
{
	/*var sel = timeline.getSelection();
	var row = sel[0].row;   
	var newItem = timeline.getItem( row );

	timeline.cancelAdd();	//let the redraw do the adding

	//ignore newItem.content 
	modal_addSlot( newItem.start, newItem.end, newItem.group, 'unknown_state_id' );*/
}

function timeline_onDelete()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var oldItem = timeline.getItem(row);
  ask_slots_delete(oldItem.start / 1000, oldItem.end / 1000, oldItem.group, oldItem.content);
  timeline.cancelDelete();
}

var timeline_selected = null;

function timeline_onSelect()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  timeline_selected = timeline.getItem(row);
  //console.log('select', timeline_selected );
}

function timeline_onChange()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var newItem = timeline.getItem(row);
  ask_slots_update(timeline_selected, newItem);
}
//////////////////




function ask_slots_add(from, till, reoc, value)
{
  //console.log( from/1000,till/1000,type,value );
  var ask_host = host;
  var resman = ask_host + '/states';
  var json = '{"end":' + (till / 1000) + ',"recursive":' + reoc + ',"start":' + (from / 1000) + ',"text":"' + value + '"}';
  //console.log("added slot: ", json);
  $.ajax({
    url: resman,
    type: 'POST',
    data: json,
    contentType: 'application/json',
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      ask_slots_getPlanning();
    }
  });
}

function ask_slots_delete(from, till, reoc, value)
{
  var ask_host = host;
  var ask_user = localStorage.getItem('loginUser');
  var resman = ask_host + '/askatars/' 
  							+ ask_user + '/slots?start=' 
  							+ from + '&end=' 
  							+ till + '&text=' 
  							+ timeline_helper_html2state(value) 
  							+ '&recursive=' 
  							+ (reoc == 'Re-occuring');
  $.ajax({
    url: resman,
    type: 'DELETE',
    //data: json, contentType: 'application/json',
    xhrFields: {
      withCredentials: true
    },
    statusCode: {
      403: function() {
        global_update('sessionID', '');
        alert("del, no session??");
      }
    },
    success: function(jdata) {
      ask_slots_getPlanning();
    }
  });
}

function ask_slots_modal_delete(from, till, reoc, value)
{
  var ask_host = host;
  var ask_user = localStorage.getItem('loginUser');
  var resman = ask_host + '/askatars/' 
  							+ ask_user + '/slots?start=' 
  							+ from + '&end=' 
  							+ till + '&text=' 
  							+ value 
  							+ '&recursive=' 
  							+ (reoc == 'Re-occuring');
  $.ajax({
    url: resman,
    type: 'DELETE',
    //data: json, contentType: 'application/json',
    xhrFields: {
      withCredentials: true
    },
    statusCode: {
      403: function() {
        global_update('sessionID', '');
        alert("del, no session??");
      }
    },
    success: function(jdata) {
      ask_slots_getPlanning();
    }
  });
}

function ask_slots_modal_update()
{
  var ask_host = host;
  var ask_user = localStorage.getItem('loginUser');
  var resman = ask_host + '/askatars/' + ask_user + '/slots';
  
  var bodyJson = '{"color":null' + ',"count":0' + ',"end":' + oldslot.till + ',"recursive":' + oldslot.reoc + ',"start":' + oldslot.from + ',"text":"' + oldslot.type + '","wish":0}';
  
  var queryJson = 'start=' + newslot.from + '&end=' + newslot.till + '&text=' + newslot.type + '&recursive=' + newslot.reoc;
  
  console.log( bodyJson,queryJson );
  $.ajax({
    url: resman + '?' + queryJson,
    type: 'PUT',
    data: bodyJson,
    contentType: 'application/json',
    xhrFields: {
      withCredentials: true
    },
    statusCode: {
      403: function() {
        alert("del, no session??");
      }
    },
    success: function(data) {
      ask_slots_getPlanning();
    }
  });
}

function ask_slots_update(oldSlot, newSlot)
{
  //console.log('upDate ', oldSlot, newSlot );
  var ask_host = host;
  var ask_user = localStorage.getItem('loginUser');
  var oldState = oldSlot.content.split('>')[1].split('<')[0];
  var newState = newSlot.content.split('>')[1].split('<')[0];
  var resman = ask_host + '/askatars/' + ask_user + '/slots';
  var bodyJson = '{"color":null'+',"count":0'+',"end":'+Math.round(oldSlot.end / 1000)+',"recursive":'+(oldSlot.group=='Re-occuring')+',"start":'+Math.round(oldSlot.start/1000)+',"text":"'+oldState+'","type":'+'"avail"'+',"wish":0}';
  var queryJson = 'start=' + Math.round(newSlot.start / 1000) + '&end=' + Math.round(newSlot.end / 1000) + '&text=' + newState + '&recursive=' + (newSlot.group == 'Re-occuring');
  //console.log( bodyJson,queryJson );
  $.ajax({
    url: resman + '?' + queryJson,
    type: 'PUT',
    data: bodyJson,
    contentType: 'application/json',
    xhrFields: {
      withCredentials: true
    },
    statusCode: {
      403: function() {
        alert("del, no session??");
      }
    },
    success: function(data) {
      ask_slots_getPlanning();
    }
  });
}

function ask_slots_getPlanning()
{
	var slots = JSON.parse(webpaige.get('slots'));    
  timeline_data = new google.visualization.DataTable();
  timeline_data.addColumn('datetime', 'start');
  timeline_data.addColumn('datetime', 'end');
  timeline_data.addColumn('string', 'content');
  timeline_data.addColumn('string', 'groups');
  for (var i in slots)
  {
    var content = colorState(slots[i].text);
    timeline_data.addRow([
    new Date(slots[i].start * 1000), new Date(slots[i].end * 1000), content, slots[i].recursive ? 'Re-occuring' : 'Plan']);
  } 
  var options = {};
  timeline.draw(timeline_data, options);


/*
  var resources = JSON.parse(webpaige.get('resources'));
  var range = {
    "start": (now - 86400 * 7 * 4 * 3),
    "end": (now + 86400 * 7 * 4 * 3)
  };
	webpaige.con(
		options = {
			path: '/askatars/'+resources.uuid+'/slots',
			json: range,
			loading: 'Loading slots..',
			label: 'slots'
			,session: session.getSession()	
		},
		function(data, label)
	  {  
			webpaige.set(label, data);
		}
	);

  var ask_host = host;
  var ask_key = session.getSession();
  
  var now = parseInt((new Date()).getTime() / 1000);
  
  // namespace for ask_user
  var resman = ask_host + '/askatars/' + ask_user.user + '/slots';
  //var resman = '/slots';
*/
  
  
/*
  $.ajax({
    url: resman,
    type: 'GET',
    data: json,
    contentType: 'application/json',
    xhrFields: {
      withCredentials: true
    },
    statusCode: {
      403: function() {
        global_update('sessionID', '');
        alert("planning, no session??");
      }
    },
    success: function(data) {
      var slots = JSON.parse(data);
      //slots = slots.data; //silly
      console.log("slots real", slots);
      timeline_data = new google.visualization.DataTable();
      timeline_data.addColumn('datetime', 'start');
      timeline_data.addColumn('datetime', 'end');
      timeline_data.addColumn('string', 'content');
      timeline_data.addColumn('string', 'groups');
      //timeline_data = [];
      for (var i in slots) {
        //var content = timeline_helper_state2html( slots[i].text );
        var content = colorState(slots[i].text);
        timeline_data.addRow([
        new Date(slots[i].start * 1000), new Date(slots[i].end * 1000), content, slots[i].recursive ? 'Re-occuring' : 'Plan']);
      }
      timeline_data.addRows([
		    [new Date(2012,05,17),, '<i class="icon-comment"></i> Conversation',''],
		    [new Date(2012,05,18,23,00,00),,'<i class="icon-envelope"></i> Mail from boss',''],
		    [new Date(2012,05,19,16,00,00),,'<i class="icon-file"></i> Report',''],
		    [new Date(2012,05,20),new Date(2012,05,21),'<i class="icon-briefcase"></i> Traject A',''],     
		    [new Date(2012,05,22),,'<i class="icon-retweet"></i> Memo',''],
		    [new Date(2012,05,23),, '<i class="icon-comment"></i> Phone call',''],
		    [new Date(2012,05,15),new Date(2012,05,16),'<i class="icon-briefcase"></i> Traject B',''],     
		    [new Date(2012,05,24,12,00,00),,'<i class="icon-file"></i> Report','']
      ]); 
      var options = {};
      //console.log("Planboard: ", timeline_data );
      timeline.draw(timeline_data, options);
    }
  });
*/
	
	
}






function colorState(state) {
  var content = '?';
  if (state == 'available') return '<div style="color:green">' + state + '</div>';
  if (state == 'unavailable') return '<div style="color:red">' + state + '</div>';
}

function timeline_helper_state2html(state) {
  var state_map = global_get('stateMap');
  var content = '?';
  if (state_map[state]) return '<div style="height:24px; background-color:' + state_map[state][1] + '">' + state_map[state][3] + '</div>';
  return "<div style='color:black;'>" + state + "</div>";
}

function timeline_helper_html2state(content) {
  var state_map = global_get('stateMap');
  var state = content.split('>')[1].split('<')[0];
  //reverse map search..
  for (var i in state_map) {
    if (state == state_map[i][0]) return i;
  }
  return state;
}









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











function onTimeChange(event)
{
	//console.log("time changed:", event);
}

function onRangeChanged(event)
{
	//console.log("range changed:", event);
	//console.log("graph:", window.graph);
	
	window.graph.setVisibleChartRange(event.start, event.end);
	//console.log(event.start.getTime(), event.end.getTime());
	
	//graph.setValueRange(event.start.getTime()+((event.end.getTime()-event.start.getTime())/2));
    
	/*
  start_time = event.start.getTime();
  end_time = event.end.getTime();
  current_time = event.start.getTime()+((event.end.getTime()-event.start.getTime())/2);
  reloadFrames();
  window.graph.redraw();
	*/
    
}
