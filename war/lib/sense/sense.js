
/*
function loadSenseSensors() {
  $.ajax({
    url: 'http://api.sense-os.nl/sensors?per_page=1000',
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-SESSION_ID', localStorage.getItem('senseSessionId'));
      return true;
    },
    contentType: 'application/json',
    xhrFields: {
      withCredentials: false
    },
    success: function(jsonData, status, xhr) {
      var json = JSON.parse(xhr.responseText);
      var sensors = json["sensors"];
      
      var latest = -1;
      
      window.positionSensors = [];
      $.each(sensors, function(i, item) {
        if (item.name == "Location") {
          loadLocationData(item.id);
        } else if (item.name == "Activity") {
          loadActivityData(item.id);
        } else if (item.name == "position") {
          window.positionSensors.push(item.id);
        }
      });
      
      $.each(window.positionSensors, function(i, item) {
        loadPositionData(item);
      });
      
    },
    error: function() {}
  });
}
*/

/*
function loadPositionData(sensorID) {

  $.ajax({
    url: 'http://api.sense-os.nl/sensors/' + sensorID + '/data.json?last=1',
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-SESSION_ID', localStorage.getItem('senseSessionId'));
      return true;
    },
    contentType: 'application/json',
    xhrFields: { withCredentials: false },
    success: function(jsonData, status, xhr) {
    	
    	// ? check later
      var json = JSON.parse(xhr.responseText);
      var data = json["data"];
              		      
      // remove sensor ID from global list of uitstaande requests      
      //console.log("response from ", sensorID);
      window.positionSensors.splice(window.positionSensors.indexOf(sensorID), 1);
          
      // check if data is latest
      if (data.length > 0) {    		
          	
		        var position = data.pop();    
		        var date = position.date;
						if (undefined == window.latest || date > window.latest) {			        
					    //console.log("this sensor is now the latest: " , sensorID, " ", date);
					    
							// this sensor is the latest
							window.latest = date;
											
							// remember the sensor ID!
							window.latestSensor = position.sensor_id;
							window.latestPosition = position;
											
			      } else {
					  	// this sensor is not the latest
			      }						
          
      }
                     
      // check if all sensors have responded       
      //console.log("wp ", window.positionSensors);
      
      if (window.positionSensors.length == 0) {
       // KLAAR
       //window.latestSensor;
       
	   		var value;
	      value = JSON.parse(window.latestPosition.value);
	   
	      $(".latitude").html(value.latitude);
	      $(".longitude").html(value.longitude);
	      $(".provider").html(value.provider);
	      $(".accuracy").html(value.accuracy);
	      date = new Date(window.latest * 1000);
	      $(".positionDate").html(date.toString("dd-MMM-yyyy HH:mm"));
	      var mapFrame = "<iframe id=\"widgetLocation\" src=\"http://localhost:8888/widget_location.html?latitude=" + value.latitude + "&longitude=" + value.longitude + "&provider=" + value.provider + "&accuracy=" + value.accuracy + "&date=" + date.toString("dd-MMM-yyyy HH:mm") + "\"></iframe>";
	      $("#mapFrame").html(mapFrame);
          
      }

    },
    error: function() {}
  });  
}
*/

// Depreciated
/*
function renderPositionData(data) {
  var position = data.pop();
  console.log('Position :', position.value);
}
*/

/*
function loadLocationData(sensorID) {
  $.ajax({
    url: 'http://api.sense-os.nl/sensors/' + sensorID + '/data.json?last=1',
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-SESSION_ID', localStorage.getItem('senseSessionId'));
      return true;
    },
    contentType: 'application/json',
    xhrFields: {
      withCredentials: false
    },
    success: function(jsonData, status, xhr) {
      var json = JSON.parse(xhr.responseText);
      var data = json["data"];
      renderLocationData(data);
    },
    error: function() {}
  });
}

function renderLocationData(data) {
  var location = data.pop();
  $("#location").html(location.value);
  var date = new Date(location.date * 1000);
  $("#locationDate").html(date.toString("dd-MMM-yyyy HH:mm"));
}

function loadActivityData(sensorID) {
  $.ajax({
    url: 'http://api.sense-os.nl/sensors/' + sensorID + '/data.json?last=1',
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-SESSION_ID', localStorage.getItem('senseSessionId'));
      return true;
    },
    contentType: 'application/json',
    xhrFields: { withCredentials: false },
    success: function(jsonData, status, xhr) {
      var json = JSON.parse(xhr.responseText);
      var data = json["data"];
      renderActivityData(data); 
    },
    error: function() {}
  });
}

function renderActivityData(data) {
  var activity = data.pop();
  var date = new Date(activity.date * 1000);
  $("#activity").html(activity.value);
  $("#activityDate").html(date.toString("dd-MMM-yyyy HH:mm"));
}
*/