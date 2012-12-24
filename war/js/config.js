'use strict';
// where is my host
//var host = 'http://localhost:9000/ns_knrm';
var host = 'http://3rc2.ask-services.appspot.com/ns_knrm';


// let's define some states
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


// population density colors for group aggregrated view in timeline
var density = ['#294929', '#4f824f', '#477547', '#436f43', '#3d673d', '#396039', '#335833', '#305330'];


// determine divisions
var divisions = [
	'knrm.StateGroup.BeschikbaarNoord',
	'knrm.StateGroup.BeschikbaarZuid',
]
// for testing
var divisions_ = []


// application window variable container for processed data
//window.app = {};


// let's define thenstructure of it
//var app = {};

// window.app = {
// 	calls: {},
	
// 	resources: {},
// 	messages: [],
// 	groups: [],
// 	parent: [],
// 	contacts: [],
// 	slots: {},
// 	wishes: {},
// 	aggs: {},
	
// 	networks: {},
	
// 	members: [],
	
// 	settings: {},
	
// 	timeline: []
// }

// TODO
// Some application general settings

var config = {
  lang: 'en'
}

// TODO
// Language settings

var ui = {
    en: {
      login: {
        title: "Login",
        header: "Login",
        label_username: "Please enter your username",
        placeholder_username: "Username",
        label_password: "Your password",
        placeholder_password: "Password",
        label_rememberMe: "Remember Me",
        button_login: "Login",
        button_loggingIn: "Logging.."
      }    
    },
    nl: {
      login: {
        title: "Login",
        header: "Login",
        label_username: "Vul uw gebruikersnaam in",
        placeholder_username: "Gebruikersnaam",
        label_password: "Vul uw wachtwoord in",
        placeholder_password: "Wachtwoord",
        label_rememberMe: "Onthoud mij",
        button_login: "Login",
        button_loggingIn: "Inloggen.."
      }         
    }
}






