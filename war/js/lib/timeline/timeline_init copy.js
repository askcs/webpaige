
var timeline = undefined;
var data = undefined;

google.load("visualization", "1");

// Set callback to run when API is loaded
google.setOnLoadCallback(drawVisualization); 

function getSelectedRow() {
  var row = undefined
  var sel = timeline.getSelection();
  if (sel.length) {
    if (sel[0].row != undefined) {
      var row = sel[0].row;
    }
  }     
  return row;       
}      

// Called when the Visualization API is loaded.
function drawVisualization() {
  // Create and populate a data table.
  data = new google.visualization.DataTable();
  data.addColumn('datetime', 'start');
  data.addColumn('datetime', 'end');
  data.addColumn('string', 'content');

  data.addRows([
    [new Date(2012,05,13), , '<div>Conversation</div>'],
    [new Date(2012,05,13,23,00,00), , '<div>Mail from boss</div>'],
    [new Date(2012,05,14,16,00,00), , 'Report'],
    [new Date(2012,05,16), new Date(2010,08,02), 'Traject A'],     
    [new Date(2012,05,18), , '<div>Memo</div>'],
    [new Date(2012,05,19), , '<div>Phone call</div>'],
    [new Date(2012,05,11), new Date(2010,08,03), 'Traject B'],     
    [new Date(2012,05,04,12,00,00), , '<div>Report</div>']
  ]);

  // specify options
  options = {
    width:  "100%", 
    height: "200px", 
    editable: true // make the events dragable
  };

  // Instantiate our timeline object.
  timeline = new links.Timeline(document.getElementById('mytimeline'));

  // Make a callback function for the select event
  var onselect = function (event) {
    var row = getSelectedRow();
    document.getElementById("info").innerHTML += "event " + row + " selected<br>";            
    // Note: you can retrieve the contents of the selected row with
    //       data.getValue(row, 2);
  }

  // callback function for the change event
  var onchange = function (event) {
    // retrieve the changed row 
    var row = getSelectedRow();

    if (row != undefined) {
      // request approval from the user. 
      // You can choose your own approval mechanism here, for example 
      // send data to a server which responds with approved/denied
      var approve = confirm("Are you sure you want to move the event?");
      
      if (approve)  {
        document.getElementById("info").innerHTML += "event " + row + " changed<br>";
      } else {
        // new date NOT approved. cancel the change
        timeline.cancelChange();

        document.getElementById("info").innerHTML += "change of event " + row + " cancelled<br>";
      }
    }
  }

  // callback function for the delete event
  var ondelete = function (event) {
    // retrieve the row to be deleted 
    var row = getSelectedRow();

    if (row != undefined) {
      // request approval from the user. 
      // You can choose your own approval mechanism here, for example 
      // send data to a server which responds with approved/denied
      var approve = confirm("Are you sure you want to delete the event?");
      
      if (approve)  {
        document.getElementById("info").innerHTML += "event " + row + " deleted<br>";
      } else {
        // new date NOT approved. cancel the change
        timeline.cancelDelete();

        document.getElementById("info").innerHTML += "deleting event " + row + " cancelled<br>";
      }
    }
  }


  // callback function for adding an event
  var onadd = function (event) {
    // retrieve the row to be deleted 
    var row = getSelectedRow();

    if (row != undefined) {
      // request approval from the user. 
      // You can choose your own approval mechanism here, for example 
      // send data to a server which responds with approved/denied
      var title = prompt("Enter a title for the new event", "New event");
      
      if (title != undefined)  {
        data.setValue(row, 2, title);
        document.getElementById("info").innerHTML += "event " + row + " created<br>";
        timeline.redraw();
      } else {
        // cancel adding a new event
        timeline.cancelAdd();

        document.getElementById("info").innerHTML += "creating event " + row + " cancelled<br>";
      }
    }
  }

  // Add event listeners
  google.visualization.events.addListener(timeline, 'select', onselect);
  google.visualization.events.addListener(timeline, 'change', onchange);
  google.visualization.events.addListener(timeline, 'delete', ondelete);
  google.visualization.events.addListener(timeline, 'add', onadd);

  // Draw our timeline with the created data and options 
  timeline.draw(data, options);
}