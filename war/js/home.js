

function homePage_init()
{
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

    //var newStartDate = new Date(document.getElementById('startDate').value);
    //var newEndDate = new Date(document.getElementById('endDate').value);
    //timeline.setVisibleChartRange(newStartDate, newEndDate);     

    /* attach an event listener using the links events handler
    function onRangeChanged(properties) {
        console.log(properties);
    }
    links.events.addListener(timeline, 'rangechanged', onRangeChanged);
	*/

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
	ask_getPlanning();
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
function timeline_onEdit()
{
	var sel = timeline.getSelection();
	var row = sel[0].row;   
	var content = timeline_data.getValue(row, 2);
    var newContent = prompt("Enter content", content);
    if (newContent != undefined) {
		timeline_data.setValue(row, 2, newContent);
	}
    timeline.redraw();
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
            var data = JSON.parse(jsonData);
            global_update('sessionID', data['X-SESSION_ID'] );
            global_update('user', user );
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

	console.log( resman, json );
    
    var noCookie = { "X-SESSION_ID": ask_key };
    document.cookie= 'X-SESSION_ID='+ask_key+'; path=/';    //does not work cross domain..
    $.ajax({
        url: resman, type: 'POST',
        data: json, contentType: 'application/json',
        xhrFields: {   withCredentials: true   },
        headers: noCookie,
        success: function(jsonData)
        {
            console.log("success!", jsonData );
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


function ask_getPlanning()
{

	var ask_host = global_get('host');
	var ask_user = global_get('user');
	var ask_key  = global_get('sessionID');

	var now = parseInt( new Date().getTime() /1000 );
    
	var resman = ask_host+'/askatars/'+ ask_user +'/slots';

	var json = {"start":(now-86400*7), "end":(now+86400*7) };

    $.ajax({
        url: resman, type: 'GET',
		data: json, contentType: 'application/json',
        xhrFields: {   withCredentials: true   },
		statusCode: {
            403: function () { alert("no session??"); }
			},
        success: function(jdata){
			var slots = JSON.parse(jdata);

			timeline_data = new google.visualization.DataTable();
			timeline_data.addColumn('datetime', 'start');
	        timeline_data.addColumn('datetime', 'end');
		    timeline_data.addColumn('string', 'content');
			timeline_data.addColumn('string', 'groups');

			//timeline_data = [];
			for(var i in slots )
			{
				var content = "<div style='color:red;'>" + slots[i].text +"</div>";
				if( slots[i].text == 'ask.state.13' )
					content = "<div style=''>" + 'busy' +"</div>";

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