'use strict';

var calls = {

  login: {
    status: true,
    content: {}
  },
    
  resources: {
    status: true,
    content: {}
  },
  
  contacts: {
    status: true,
    content: {}
  },
  
  messages: {
    status: true,
    content: {}
  },
    
  network: {
    status: true,
    content: {},
    traverse: {}
  },

  parent: {
    status: true,
    content: {},
    traverse: {}
  }
  
}
	
//var host = 'http://localhost:9000/ns_knrm';
var host = 'http://3rc2.ask-services.appspot.com/ns_knrm';


var states = {
    "com.ask-cs.State.Available": {
        "className": "state-available",
        "label": "Beschiekbaar",
        "color": "#4f824f"
    },
    "com.ask-cs.State.KNRM.BeschikbaarNoord": {
        "className": "state-available-north",
        "label": "Beschikbaar voor Noord",
        "color": "#000"
    },
    "com.ask-cs.State.KNRM.BeschikbaarZuid": {
        "className": "state-available-south",
        "label": "Beschiekbaar voor Zuid",
        "color": "#e08a0c"
    },
    "com.ask-cs.State.Unavailable": {
        "className": "state-unavailable",
        "label": "Niet Beschiekbaar",
        "color": "#a93232"
    },
    "com.ask-cs.State.KNRM.SchipperVanDienst": {
        "className": "state-schipper-service",
        "label": "Schipper van Dienst",
        "color": "#e0c100"
    },
    "com.ask-cs.State.Unreached": {
        "className": "state-unreached",
        "label": "Niet Bereikt",
        "color": "#65619b"
    }
}


var density = ['#294929', '#4f824f', '#477547', '#436f43', '#3d673d', '#396039', '#335833', '#305330'];


var data = [];

window.app = {};

var app = {};

window.app.user = {
	resources: {},
	questions: [],
	groups: [],
	parent: [],
	contacts: [],
	slots: {
		seperated: [],
		combined: []
	}
}

window.app.members = {}

window.app.networks = {}

	
$.ajaxSetup(
{
  contentType: 'application/json',
  xhrFields: { 
  	withCredentials: true
  },
  beforeSend: function(xhr)
  {
  	xhr.setRequestHeader('X-SESSION_ID', session.getSession());
  }		
})






