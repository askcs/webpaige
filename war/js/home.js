

function homePage_init()
{
	var ask_session = global_get('sessionID');
	if( ask_session == '' )
	{
		console.log("not logged in");
		return;
	}

	//retrieve from db?
	global_update('stateMap',
		{ 
	'ask.state.12' : ['meeting','#77d'], 
	'ask.state.13' : ['nr13','red'], 
	'ask.state.14' : ['nr14','green'] 
		}
	);

	jos_timeline();

	home_getLocation();
}

var timeline;
var timeline_data = [];
function jos_timeline() {

	timeline_data = [];

    // specify options
    var options = {
        'width': '100%',
        'height': '300px',
        'editable': true,   // enable dragging and editing events 
        'style': 'box'
    };

    timeline = new links.Timeline(document.getElementById('mytimeline'));

	// Add event listeners
	google.visualization.events.addListener(timeline, 'edit', timeline_onEdit);
	google.visualization.events.addListener(timeline, 'add', timeline_onAdd );
	google.visualization.events.addListener(timeline, 'delete', timeline_onDelete );
	google.visualization.events.addListener(timeline, 'change', timeline_onChange );
	google.visualization.events.addListener(timeline, 'select', timeline_onSelect );

    //var newStartDate = new Date(document.getElementById('startDate').value);
    //var newEndDate = new Date(document.getElementById('endDate').value);
    //timeline.setVisibleChartRange(newStartDate, newEndDate);     

    /* attach an event listener using the links events handler
    function onRangeChanged(properties) {
        console.log(properties);
    }
    links.events.addListener(timeline, 'rangechanged', onRangeChanged);
	*/
			
	var lab = new Object();
	lab.start = new Date(0);
	lab.content = '';
	lab.group  = '<div>plan</div>';
	timeline.addItem( lab );
	timeline.addGroup( "<div>plan</div>" );


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

function timeline_locationEvent(data, prevData )
{
	//dont show initial event?
	if( !prevData )return;
		
	timeline_data.push({
        'start': new Date(),
        //'end': new Date(2012, 2, 1),  // end is optional
        'content':  'set location <br/>' +data[0]+" , "+data[1],
        // Optional: a fourth parameter 'group'
    });
	timeline.draw(timeline_data, options);
}


function timeline_helper_html2state(content)
{
	var state_map = global_get('stateMap');

	var state = content.split('>')[1].split('<')[0] ;
	//reverse map search..
	for(var i in state_map )
	{
		if( state == state_map[i][0] )return i;
	}
	return state;
}
function timeline_helper_state2html(state)
{
	var state_map = global_get('stateMap');

	var content = '?';

	if( state_map[ state ] )return '<div style="height:24px; background-color:'+state_map[ state ][1]+'">' + state_map[ state ][0] + '</div>';
	return "<div style='color:black;'>" + state +"</div>";
}


function timeline_onEdit()
{
	var sel = timeline.getSelection();
	var row = sel[0].row;   
	var curItem = timeline.getItem( row );
	var content = timeline_data.getValue(row, 2);

	modal_editSlot( curItem.start, curItem.end, curItem.group, timeline_helper_html2state( content ) );
/*
    var newContent = prompt("Enter content", content);
    if (newContent != undefined) {
		timeline_data.setValue(row, 2, newContent);
	}
    timeline.redraw();
*/
	//timeline.cancelEdit(); //doesnt exist
}
function timeline_onAdd()
{
	var sel = timeline.getSelection();
	var row = sel[0].row;   
	var newItem = timeline.getItem( row );

	timeline.cancelAdd();	//let the redraw do the adding

	//ignore newItem.content 
	modal_addSlot( newItem.start, newItem.end, newItem.group, 'unknown_state_id' );

}

function timeline_onDelete()
{
	var sel = timeline.getSelection();
	var row = sel[0].row;   
	var oldItem = timeline.getItem( row );

	ask_slots_delete( oldItem.start/1000, oldItem.end/1000, oldItem.group, oldItem.content );

	timeline.cancelDelete();
}


var timeline_selected = null;
function timeline_onSelect()
{
	var sel = timeline.getSelection();
	var row = sel[0].row;   
	timeline_selected = timeline.getItem( row );
	//console.log('select', timeline_selected );
}
function timeline_onChange()
{
	var sel = timeline.getSelection();
	var row = sel[0].row;   
	var newItem = timeline.getItem( row );
	ask_slots_update(  timeline_selected, newItem );

	
}


//////////////////

function ask_login(user, pass) {

    //debugging.. (remove this line)
    if( pass!='1234') pass = MD5(pass);
    
	var ask_host = global_get('host');

    var xhr = $.ajax({ url: ask_host + '/login?uuid=' + user + '&pass=' + pass,
        /*
        //dataType: 'jsonp',
        statusCode: {
            400: function () { alert("Username or password incorrect"); 
            window.location = "login.html"; }
        },
        */
        xhrFields: {
            withCredentials: true
        },
        success: function (jsonData, status, xhr) {

		//in chrome json is already parsed?
		if( jsonData && jsonData['X-SESSION_ID'] )
			var data = jsonData;
		else
			var data = JSON.parse(jsonData);
	
		global_update('sessionID', data['X-SESSION_ID'] );
		global_update('user', user );
		menu_set(0);

            /*
            if (r != null) {
                localStorage.setItem("loginCredentials", user + ";" + pass);
            } else {
                localStorage.removeItem("loginCredentials");
            }
            document.location = "/";
            */
        },
        error: function (xhr, status) {
            //console.log(xhr);
            global_update('sessionID', '');
            alert('Invalid login or password');
        },
        /*
        complete: function (xhr, status) {
            var json = JSON.parse(xhr.responseText);
            var sessionId = json["X-SESSION_ID"];
            var session = new ask.session();
            session.setSession(sessionId);
            document.cookie = "sessionId=" + session;
        }
        */
    });
	 

}



function home_setLocation(data)
{

	if( !data['lati'] || !data['longi'] )return;
	
	var ask_host = global_get('host');
	var ask_user = global_get('user');
	var ask_key  = global_get('sessionID');
    
	//ajax
	
    var resman = ask_host+'/rev1/node/'+ ask_user +'/timeline/latlong_final';

    var state = '[' + data['lati'] + ',' + data['longi'] +']';
	var now = parseInt( new Date().getTime() /1000 );
    var json = '{"data":{"value":'+state+',"date":'+now+'}}';

	//console.log( resman, json );
    
    var noCookie = { "X-SESSION_ID": ask_key };
    document.cookie= 'X-SESSION_ID='+ask_key+'; path=/';    //does not work cross domain..
    $.ajax({
        url: resman, type: 'POST',
        data: json, contentType: 'application/json',
        xhrFields: {   withCredentials: true   },
        headers: noCookie,
	statusCode: {
            403: function () { alert("gps, no session??"); }
	},
        success: function(jsonData)
        {
            //console.log("success!", jsonData );
			global_update("location" , [ data['lati'],data['longi'] ] );
        }
    });

}


function home_getLocation()
{
	var ask_host = global_get('host');
	var ask_user = global_get('user');
	var ask_key  = global_get('sessionID');
    
	var resman = ask_host+'/rev1/node/'+ ask_user +'/timeline/latlong';

    $.ajax({
        url: resman,
        type: 'GET',
        xhrFields: {   withCredentials: true   },
        success: function(jdata){
            var data = JSON.parse(jdata);
            data =data.data; //silly level
			global_update("location" , data['value'] );
        }
    });

}



function ask_slots_add( from,till, type, value )
{
	console.log( from/1000,till/1000,type,value );

	var ask_host = global_get('host');

	var resman = ask_host+'/states';
	var json = '{"color":null'
		+',"count":0'
		+',"end":'+(till/1000)
		+',"recursive":'+ (type=='reoc')
		+',"start":'+(from/1000)
		+',"text":"'+ timeline_helper_html2state( value )
		+'","type":'+'"avail"'
		+',"wish":0}';

	$.ajax({
		url: resman, type: 'POST',
		data: json, contentType: 'application/json',
		xhrFields: {   withCredentials: true   },
		success: function(jdata)
		{
			ask_slots_getPlanning();
		}
	});
}

function ask_slots_delete( from,till, type, value )
{
	var ask_host = global_get('host');
	var ask_user = global_get('user');

	var resman = ask_host+'/askatars/'+ask_user+'/slots?start='+from
		+'&end='+till
		+'&text='+timeline_helper_html2state(value)
		+'&recursive='+(type=='reoc');

	$.ajax({
		url: resman, type: 'DELETE',
		//data: json, contentType: 'application/json',
		xhrFields: {   withCredentials: true   },
		statusCode: {
	            403: function () 
			{
				global_update('sessionID','');
				alert("del, no session??"); 
			}

		},
		success: function(jdata)
		{
			ask_slots_getPlanning();
		}
	});
}

function ask_slots_update( oldSlot, newSlot )
{
	//console.log('upDate ', oldSlot, newSlot );
	
	var ask_host = global_get('host');
	var ask_user = global_get('user');

	var resman = ask_host+'/askatars/'+ask_user+'/slots';
	var bodyJson = '{"color":null'
		+',"count":0'
		+',"end":'+(oldSlot.end/1000)
		+',"recursive":'+ (oldSlot.group=='reoc')
		+',"start":'+(oldSlot.start/1000)
		+',"text":"'+ timeline_helper_html2state(oldSlot.content)
		+'","type":'+'"avail"'
		+',"wish":0}';

	var queryJson = 'start='+(newSlot.start/1000)
		+'&end='+(newSlot.end/1000)
		+'&text='+ timeline_helper_html2state(newSlot.content)
		+'&recursive='+(newSlot.group=='reoc');

	console.log( bodyJson,queryJson );

	$.ajax({
		url: resman +'?'+queryJson , type: 'PUT',
		data: bodyJson, contentType: 'application/json',
		xhrFields: {   withCredentials: true   },
		statusCode: {
	            403: function () { alert("del, no session??"); }
		},
		success: function(jdata)
		{
			ask_slots_getPlanning();
		}
	});

}


function ask_slots_getPlanning()
{

	var ask_host = global_get('host');
	var ask_user = global_get('user');
	var ask_key  = global_get('sessionID');

	var now = parseInt( new Date().getTime() /1000 );
    
	var resman = ask_host+'/askatars/'+ ask_user +'/slots';
	//var resman = ask_host+'/rev1/node/'+ ask_user +'/timeline/'+'avail';

	var json =  {"start": (now-86400*7*4), "end": (now+86400*7*4) };
	//var json = ' {"start":'+(now-86400*7*2)+', "end":'+(now+86400*7*2)+' }';

    $.ajax({
        url: resman, type: 'GET',
		data: json, contentType: 'application/json',
        xhrFields: {   withCredentials: true   },
	statusCode: {
        	403: function () { 
			global_update('sessionID','');
			alert("planning, no session??"); 
		}
	},
        success: function(jdata){
			var slots = JSON.parse(jdata);
			//slots = slots.data; //silly

			timeline_data = new google.visualization.DataTable();
			timeline_data.addColumn('datetime', 'start');
		        timeline_data.addColumn('datetime', 'end');
			timeline_data.addColumn('string', 'content');
			timeline_data.addColumn('string', 'groups');

			//timeline_data = [];
			for(var i in slots )
			{
				var content = timeline_helper_state2html( slots[i].text );

				timeline_data.addRow( [
					new Date( slots[i].start *1000),
					new Date( slots[i].end *1000), 
					content,
					slots[i].recursive?'reoc':'plan' ] );
			}
			console.log("new planboard: ", timeline_data );
			timeline.draw(timeline_data, options);
        }
    });

	
}
