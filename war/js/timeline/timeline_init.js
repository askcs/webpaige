

function homePage_init()
{
	var ask_session = session.getSession();
	if( ask_session == '' )
	{
		//console.log("not logged in");
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
}

var timeline;
var timeline_data = [];
function jos_timeline() {

	timeline_data = [];

    // specify options
    var options = {
        'width': '100%',
        'height': '240px',
        'editable': true,   // enable dragging and editing events 
        'style': 'box'
    };

    timeline = new links.Timeline(document.getElementById('mytimeline'));

	// Add event listeners
	google.visualization.events.addListener(timeline, 'edit', timeline_onEdit );
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
	lab.group  = '<div>Plan</div>';
	timeline.addItem( lab );
	timeline.addGroup( "<div>Plan</div>" );


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



function ask_slots_add( from,till, type, value )
{
	//console.log( from/1000,till/1000,type,value );

	var ask_host = host;

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
		success: function(data)
		{
			ask_slots_getPlanning();
		}
	});
}

function ask_slots_delete( from,till, type, value )
{

	var ask_host = host;
	var ask_user = localStorage.getItem('loginUser');

	var resman = ask_host+'/askatars/'+ask_user+'/slots?start='+from
		+'&end='+till
		+'&text='+timeline_helper_html2state(value)
		+'&recursive='+(type=='Re-occuring');

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
	
	var ask_host = host;
	var ask_user = localStorage.getItem('loginUser');
	var oldState = oldSlot.content.split('>')[1].split('<')[0] ;
	var newState = newSlot.content.split('>')[1].split('<')[0] ;

	var resman = ask_host+'/askatars/'+ask_user+'/slots';
	var bodyJson = '{"color":null'
		+',"count":0'
		+',"end":'+(oldSlot.end/1000)
		+',"recursive":'+ (oldSlot.group=='Re-occuring')
		+',"start":'+(oldSlot.start/1000)
		+',"text":"'+ oldState
		+'","type":'+'"avail"'
		+',"wish":0}';

	var queryJson = 'start='+(newSlot.start/1000)
		+'&end='+(newSlot.end/1000)
		+'&text='+ newState
		+'&recursive='+(newSlot.group=='Re-occuring');

	//console.log( bodyJson,queryJson );

	$.ajax({
		url: resman +'?'+queryJson , 
		type: 'PUT',
		data: bodyJson, contentType: 'application/json',
		xhrFields: {
			withCredentials: true
		},
		statusCode: {
	  	403: function () {
	  		alert("del, no session??");
	  	}
		},
		success: function(data)
		{
			ask_slots_getPlanning();
		}
	});

}


function ask_slots_getPlanning()
{

	var ask_host = host;
	var ask_user = localStorage.getItem('loginUser');
	var ask_key  = session.getSession();

	var now = parseInt( (new Date()).getTime() /1000 );
	    
	var resman = ask_host+'/askatars/'+ ask_user +'/slots';

	var json =  {"start": (now-86400*7*4), "end": (now+86400*7*4) };

    $.ajax({
        url: resman,
        type: 'GET',
				data: json, contentType: 'application/json',
        xhrFields: {
        	withCredentials: true
        },
				statusCode: {
			    403: function () { 
						global_update('sessionID','');
						alert("planning, no session??"); 
					}
				},
        success: function(data){
			var slots = JSON.parse(data);
			//slots = slots.data; //silly

			timeline_data = new google.visualization.DataTable();
			timeline_data.addColumn('datetime', 'start');
		  timeline_data.addColumn('datetime', 'end');
			timeline_data.addColumn('string', 'content');
			timeline_data.addColumn('string', 'groups');

			//timeline_data = [];
			for(var i in slots )
			{
				//var content = timeline_helper_state2html( slots[i].text );
				var content = colorState( slots[i].text );

				timeline_data.addRow( [
					new Date( slots[i].start *1000),
					new Date( slots[i].end *1000), 
					content,
					slots[i].recursive?'Re-occuring':'Plan' ] );
			}
			//console.log("Planboard: ", timeline_data );
			timeline.draw(timeline_data, options);
        }
    });
}


function colorState(state)
{
	var content = '?';

	if( state == 'available' ) return '<div style="color:green">' + state + '</div>';
	if( state == 'unavailable' ) return '<div style="color:red">' + state + '</div>';
}


function timeline_helper_state2html(state)
{
	var state_map = global_get('stateMap');

	var content = '?';

	if( state_map[ state ] )return '<div style="height:24px; background-color:'+state_map[ state ][1]+'">' + state_map[ state ][3] + '</div>';
	return "<div style='color:black;'>" + state +"</div>";
}
