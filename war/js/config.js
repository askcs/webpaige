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

// TODO
// Some application general settings

var config = {
  lang: 'nl'
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
      },
      error: {
        required: "This field is required.",
        remote: "Please fix this field.",
        email: "Please enter a valid email address.",
        url: "Please enter a valid URL.",
        date: "Please enter a valid date.",
        dateISO: "Please enter a valid date (ISO).",
        number: "Please enter a valid number.",
        digits: "Please enter only digits.",
        creditcard: "Please enter a valid credit card number.",
        equalTo: "Please enter the same value again.",
        maxlength: "Please enter no more than {0} characters.",
        minlength: "Please enter at least {0} characters.",
        rangelength: "Please enter a value between {0} and {1} characters long.",
        range: "Please enter a value between {0} and {1}.",
        max: "Please enter a value less than or equal to {0}.",
        min: "Please enter a value greater than or equal to {0}." ,
        messages: {
          login: "<strong>Login failed!</strong><br>Wrong username or password."
        },
        ajax: {
          noConnection: 'Not connected! Verify your network.',

        }
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
      },
      error: {
        required: "Dit is een verplicht veld.",
        remote: "Controleer dit veld.",
        email: "Vul hier een geldig e-mailadres in.",
        url: "Vul hier een geldige URL in.",
        date: "Vul hier een geldige datum in.",
        dateISO: "Vul hier een geldige datum in (ISO-formaat).",
        number: "Vul hier een geldig getal in.",
        digits: "Vul hier alleen getallen in.",
        creditcard: "Vul hier een geldig creditcardnummer in.",
        equalTo: "Vul hier dezelfde waarde in.",
        accept: "Vul hier een waarde in met een geldige extensie.",
        maxlength: "Vul hier maximaal {0} tekens in.",
        minlength: "Vul hier minimaal {0} tekens in.",
        rangelength: "Vul hier een waarde in van minimaal {0} en maximaal {1} tekens.",
        range: "Vul hier een waarde in van minimaal {0} en maximaal {1}.",
        max: "Vul hier een waarde in kleiner dan of gelijk aan {0}.",
        min: "Vul hier een waarde in groter dan of gelijk aan {0}.",
        messages: {
          login: "<strong>Inloggen is mislukt!</strong><br>Onjuiste gebruikersnaam of wachtwoord."
        },
        ajax: {
          
        }
      }         
    }
}


// application window variable container for processed data
//window.app = {};


// let's define thenstructure of it
//var app = {};

// window.app = {
//  calls: {},
    
//  resources: {},
//  messages: [],
//  groups: [],
//  parent: [],
//  contacts: [],
//  slots: {},
//  wishes: {},
//  aggs: {},
    
//  networks: {},
    
//  members: [],
    
//  settings: {},
    
//  timeline: []
// }






