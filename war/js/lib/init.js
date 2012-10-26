// Good old webpaige class
// TODO

webpaige = function()
{
  this.options = {
  	host: host,
  	path: null,
  	json: null,
  	type: 'get',
  	session: session,
  	//session: '6ae2d6e8b89bb894162d960dce5791b0de3ca6bf1e8372d97e5da085b7ad967d',
  	credentials: true,
  	loading: 'Laden..',
  	message: 'Succes!',
  	label: 'not_labeled',
  	400: null,
  };  
	window.data = [];
}


webpaige.prototype.get = function(label)
{
	return localStorage.getItem(label);
}


webpaige.prototype.set = function(label, data)
{
	window.data[label] = data;
	localStorage.setItem(label, data);
}


webpaige.prototype.config = function(key, value)
{
	var config = JSON.parse(webpaige.get('config'));
	if (value != null)
	{
		config[key] = value;
		webpaige.set('config', JSON.stringify(config));
		return true;
	}
	else
	{
		return config[key];
	}
}


webpaige.prototype.remove = function(label)
{
	localStorage.removeItem(label);
}


webpaige.prototype.clear = function(label)
{
	localStorage.clear();
}


webpaige.prototype.con = function(options, callback)
{
	var w = this;
	options = $.extend({}, this.options, options);
  $.ajax(
  {
    url: options.host + options.path,
	  type: options.type,
		data: options.json,
    beforeSend: function(xhr)
    {
    	w.stats(options.loading);
    	if (options.session != null)
    	{
      	xhr.setRequestHeader('X-SESSION_ID', options.session);
    	}
      return true;
    },
    contentType: 'application/json',
    xhrFields: { 
    	withCredentials: options.credentials
    },
    success: function(data)
    {    
    	webpaige.loaded();
    	if (options.message != null)
    	{
    		webpaige.message(options.message);
    	}
      if(data && typeof data == 'string' && data != 'ok')
      	data = JSON.parse(data);
    	callback(data, options.label);
    },
    error: function(jqXHR, exception, options)
    {
      if (jqXHR.status === 0)
      {
      	webpaige.alert('Not connected. Verify Network.');
      }
      else if (jqXHR.status == 400)
      {
      	var rerror = jqXHR.responseText.split('<title>')[1].split('</title>')[0];
      	if (rerror === '400 bad credentials')
      	{
			    $("#alertDiv").show();
			    $("#alertMessage").html("<strong>Login failed!</strong><br>Wrong username or password.");
			    $("#ajaxLoader").hide();
			    $('#status').hide();
      	}
      	webpaige.alert('Bad request. [400]');
      }
      else if (jqXHR.status == 404)
      {
        webpaige.alert('Requested page not found. [404]');
      }
      else if (jqXHR.status == 500)
      {
       	webpaige.alert('Internal server error. [500]');
      }
      else if (exception === 'parser error')
      {
        webpaige.alert('Requested JSON parse failed.');
      }
      else if (exception === 'timeout')
      {
        webpaige.alert('Time out error.');
      }
      else if (exception === 'abort')
      {
        webpaige.alert('Ajax request aborted.');
      }
      else
      {
        webpaige.alert('Uncaught Error. ' + jqXHR.responseText);
      }
    }
  });
}


webpaige.prototype.stats = function(loading)
{
	$('#loading').remove();
	var loading = '<div id="loading"><img alt="Loading" src="img/ajax-loader-snake.gif"><span id="loading">' + loading + '</span></div>';
	$('#status').append(loading);
	$('#status').show();
}


webpaige.prototype.loaded = function()
{
	$('#status').hide();
}


webpaige.prototype.message = function(message)
{
	$('#message').remove();
	$('#alert').append('<div id="message">Success! ' + message + "</div>");
	$('#alert').show();
	$('#alert').delay(900).fadeOut(400);
}


webpaige.prototype.alert = function(message)
{
	$('#message').remove();
	$('#alert').append('<div id="message">Error! ' + message + "</div>");
	$('#alert').show();
	$('#alert').delay(900).fadeOut(400);
}


webpaige.prototype.logout = function()
{
	webpaige.con(
		options = {
			path: '/logout',
			loading: 'Uitloggen..'
			,session: session.getSession()	
		},
		function(data)
	  {
	  	var login = webpaige.get('login');  
			webpaige.clear();
			webpaige.set('login', login);
			session.clear();
			window.location = "login.html";
		}
	); 
}


webpaige.prototype.getRole = function()
{
	return webpaige.config('userRole');		
}


/*
webpaige.prototype.fetch = function(sets)
{
	for (var i in sets)
	{
		
	}
}
*/


webpaige.prototype.networks = function()
{
	var data = JSON.parse('[{"name":"Schipperssss","resources":{"id":"f609041a-69b6-1030-a3ab-005056bc7e66","name":"Schippers"},"serviceCount":-1,"serviceID":"","type":"","uuid":"f609041a-69b6-1030-a3ab-005056bc7e66"},{"name":"Opstappers","resources":{"id":"a2408ffc-69b5-1030-a3ab-005056bc7e66","name":"Opstappers"},"serviceCount":-1,"serviceID":"","type":"","uuid":"a2408ffc-69b5-1030-a3ab-005056bc7e66"}]');
	return data;	
}


webpaige.prototype.resources = function()
{
	var data = JSON.parse('{"askatar":null,"askPass":"eadeb77d8fba90b42b32b7de13e8aaa6","PostZip":null,"PhoneAddress":"+31627033823","Identification Data":"apptestknrm","settingsPaige":"{\"general\":{\"profile\":{\"uuid\":\"apptestknrm\",\"name\":\"apptest knrm\",\"mail\":{\"apptestknrm\":\"apptestknrm\"},\"phone\":{\"0123456789\":\"0123456789\",\"9876543210\":\"9876543210\"}},\"socialmedia\":{\"facebook\":{},\"google\":{\"authOK\":\"false\"},\"linkedin\":{},\"twitter\":{},\"yahoo\":{},\"youtube\":{}},\"energy\":\"Eco\",\"language\":\"English\"},\"appointment\":{\"c8d3ed60-8c79-4fb7-aeee-03ca45a57ea2\":{\"days\":{},\"time_from\":\"1340834400\",\"time_to\":\"1340834400\"}},\"privacy\":{\"text\":\"text\"},\"states\":{\"share\":{\"availability\":\"None\",\"activity\":\"none\",\"mood\":\"none\",\"connectedness\":\"none\",\"location\":\"none\"},\"homepage\":{\"availability\":true,\"activity\":true,\"mood\":true,\"connectedness\":true,\"location\":true}},\"about\":{\"version\":\"0.1.3\",\"releasedate\":\"2012/07/17\"}}","C2DMKey":"APA91bGvLs90vJcNoE-yqLGM2a_x1px5n3MrZ1aeeKaf-A5sm-w3l7NLO74IybdEsDhipaXoVEainC8_A_5QODXZG-3njkU7SUp9n3iz3t4eKrmUilk74qAPOmzh8vES3TpMHqEBwDUgKQcx4UbR_8ULFdBJzL7euA","PostAddress":null,"PostCity":null,"name":"apptest knrm","EmailAddress":"dferro@ask-cs.com","role":"1","uuid":"apptestknrm"}');
	return data;	
}
















webpaige.prototype.slots = function()
{

	var apptestknrm = '[{"count":0,"end":1350597600,"recursive":true,"start":1350573110,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1350684000,"recursive":true,"start":1350597600,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"availability","wish":0},{"count":0,"end":1350770400,"recursive":true,"start":1350684000,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1350943200,"recursive":true,"start":1350770400,"text":"com.ask-cs.State.Available","type":"availability","wish":0},{"count":0,"end":1351029600,"recursive":true,"start":1350943200,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351116000,"recursive":true,"start":1351029600,"text":"com.ask-cs.State.KNRM.BeschikbaarNoord","type":"availability","wish":0},{"count":0,"end":1351202400,"recursive":true,"start":1351116000,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351288800,"recursive":true,"start":1351202400,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"availability","wish":0},{"count":0,"end":1351375200,"recursive":true,"start":1351288800,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351551600,"recursive":true,"start":1351375200,"text":"com.ask-cs.State.Available","type":"availability","wish":0},{"count":0,"end":1351638000,"recursive":true,"start":1351551600,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351724400,"recursive":true,"start":1351638000,"text":"com.ask-cs.State.KNRM.BeschikbaarNoord","type":"availability","wish":0},{"count":0,"end":1351782710,"recursive":true,"start":1351724400,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1350597600,"recursive":false,"start":1350511200,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"","wish":0},{"count":0,"end":1350630420,"recursive":false,"start":1350597600,"text":"com.ask-cs.State.Available","type":"","wish":0},{"count":0,"end":1350640800,"recursive":false,"start":1350630420,"text":"com.ask-cs.State.KNRM.BeschikbaarNoord","type":"","wish":0},{"count":0,"end":1350680400,"recursive":false,"start":1350640800,"text":"com.ask-cs.State.Available","type":"","wish":0},{"count":0,"end":1350684000,"recursive":false,"start":1350680400,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"","wish":0},{"count":0,"end":1350770400,"recursive":false,"start":1350684000,"text":"com.ask-cs.State.Unavailable","type":"","wish":0},{"count":0,"end":1350856800,"recursive":false,"start":1350770400,"text":"com.ask-cs.State.Available","type":"","wish":0}]';
	
	var fok = '[{"count":0,"end":1350972000,"recursive":false,"start":1350878400,"text":"com.ask-cs.State.Unavailable","type":"","wish":0},{"count":0,"end":1351666800,"recursive":false,"start":1351573200,"text":"com.ask-cs.State.Unavailable","type":"","wish":0},{"count":0,"end":1351926000,"recursive":false,"start":1351832400,"text":"com.ask-cs.State.Unavailable","type":"","wish":0}]';
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var cache = {
	
		"config": {"userRole":"1","trange":{"bstart":1350647846,"bend":1351857446,"start":"2012-10-20T22:00:00.000Z","end":"2012-10-30T23:00:00.000Z"},"treset":{"bstart":1350647846,"bend":1351857446,"start":"2012-10-20T22:00:00.000Z","end":"2012-10-30T23:00:00.000Z"},"firstGroupUUID":"f609041a-69b6-1030-a3ab-005056bc7e66","firstGroupName":"Schippers","guuid":"f609041a-69b6-1030-a3ab-005056bc7e66","gname":"Schippers","both":[{"group":"Schippers","start":1350647846000,"end":1350658800000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #4f824f;\" title=\"Huidig aantal beschikbaar: 2 personen\"><span class=\"badge badge-inverse\">2</span></div>"},{"group":"Schippers","start":1350658800000,"end":1350684000000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers","start":1350684000000,"end":1350770400000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers","start":1350770400000,"end":1350943200000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers","start":1350943200000,"end":1351029600000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers","start":1351029600000,"end":1351116000000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers","start":1351116000000,"end":1351202400000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers","start":1351202400000,"end":1351288800000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers","start":1351288800000,"end":1351375200000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers","start":1351375200000,"end":1351551600000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers","start":1351551600000,"end":1351576800000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers","start":1351576800000,"end":1351638000000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers","start":1351638000000,"end":1351724400000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #4f824f;\" title=\"Huidig aantal beschikbaar: 2 personen\"><span class=\"badge badge-inverse\">2</span></div>"},{"group":"Schippers","start":1351724400000,"end":1351810800000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers","start":1351810800000,"end":1351857446000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #4f824f;\" title=\"Huidig aantal beschikbaar: 2 personen\"><span class=\"badge badge-inverse\">2</span></div>"}],"south":[{"group":"Schippers Station Zuid","start":1350647846000,"end":1350658800000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #4f824f;\" title=\"Huidig aantal beschikbaar: 2 personen\"><span class=\"badge badge-inverse\">2</span></div>"},{"group":"Schippers Station Zuid","start":1350658800000,"end":1350684000000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers Station Zuid","start":1350684000000,"end":1350770400000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers Station Zuid","start":1350770400000,"end":1350943200000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers Station Zuid","start":1350943200000,"end":1351202400000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers Station Zuid","start":1351202400000,"end":1351288800000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers Station Zuid","start":1351288800000,"end":1351375200000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers Station Zuid","start":1351375200000,"end":1351551600000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers Station Zuid","start":1351551600000,"end":1351576800000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers Station Zuid","start":1351576800000,"end":1351810800000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers Station Zuid","start":1351810800000,"end":1351857446000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #4f824f;\" title=\"Huidig aantal beschikbaar: 2 personen\"><span class=\"badge badge-inverse\">2</span></div>"}],"north":[{"group":"Schippers Station Noord","start":1350647846000,"end":1350658800000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #4f824f;\" title=\"Huidig aantal beschikbaar: 2 personen\"><span class=\"badge badge-inverse\">2</span></div>"},{"group":"Schippers Station Noord","start":1350658800000,"end":1350680400000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers Station Noord","start":1350680400000,"end":1350770400000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers Station Noord","start":1350770400000,"end":1350943200000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers Station Noord","start":1350943200000,"end":1351029600000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers Station Noord","start":1351029600000,"end":1351116000000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers Station Noord","start":1351116000000,"end":1351375200000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers Station Noord","start":1351375200000,"end":1351551600000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers Station Noord","start":1351551600000,"end":1351576800000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:20px;background-color: #a93232;\" title=\"Huidig aantal beschikbaar: 0 personen\"><span class=\"badge badge-inverse\">0</span></div>"},{"group":"Schippers Station Noord","start":1351576800000,"end":1351638000000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"},{"group":"Schippers Station Noord","start":1351638000000,"end":1351724400000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #4f824f;\" title=\"Huidig aantal beschikbaar: 2 personen\"><span class=\"badge badge-inverse\">2</span></div>"},{"group":"Schippers Station Noord","start":1351724400000,"end":1351857446000,"content":"<div class=\"requirement\" style=\"height:100px;\" title=\"Minimum aantal benodigden: 1 personen\"></div><div class=\"bar\" style=\"height:100px;background-color: #e0c100;\" title=\"Huidig aantal beschikbaar: 1 personen\"><span class=\"badge badge-inverse\">1</span></div>"}]},
		
		"resources": {"askatar":null,"askPass":"eadeb77d8fba90b42b32b7de13e8aaa6","PostZip":null,"PhoneAddress":"+31627033823","Identification Data":"apptestknrm","settingsPaige":"{\"general\":{\"profile\":{\"uuid\":\"apptestknrm\",\"name\":\"apptest knrm\",\"mail\":{\"apptestknrm\":\"apptestknrm\"},\"phone\":{\"0123456789\":\"0123456789\",\"9876543210\":\"9876543210\"}},\"socialmedia\":{\"facebook\":{},\"google\":{\"authOK\":\"false\"},\"linkedin\":{},\"twitter\":{},\"yahoo\":{},\"youtube\":{}},\"energy\":\"Eco\",\"language\":\"English\"},\"appointment\":{\"c8d3ed60-8c79-4fb7-aeee-03ca45a57ea2\":{\"days\":{},\"time_from\":\"1340834400\",\"time_to\":\"1340834400\"}},\"privacy\":{\"text\":\"text\"},\"states\":{\"share\":{\"availability\":\"None\",\"activity\":\"none\",\"mood\":\"none\",\"connectedness\":\"none\",\"location\":\"none\"},\"homepage\":{\"availability\":true,\"activity\":true,\"mood\":true,\"connectedness\":true,\"location\":true}},\"about\":{\"version\":\"0.1.3\",\"releasedate\":\"2012/07/17\"}}","C2DMKey":"APA91bGvLs90vJcNoE-yqLGM2a_x1px5n3MrZ1aeeKaf-A5sm-w3l7NLO74IybdEsDhipaXoVEainC8_A_5QODXZG-3njkU7SUp9n3iz3t4eKrmUilk74qAPOmzh8vES3TpMHqEBwDUgKQcx4UbR_8ULFdBJzL7euA","PostAddress":null,"PostCity":null,"name":"apptest knrm","EmailAddress":"dferro@ask-cs.com","role":"1","uuid":"apptestknrm"},
		
		"messages": [{"uuid":"c30cd78f-723b-4f19-bc62-2e6b97939c72","subject":"cengiz: testing messaging","question_text":"lets see if it works..","requester":"http://sven.ask-services.appspot.com/eveagents/personalagent/apptestknrm/","responder":["http://sven.ask-services.appspot.com/eveagents/personalagent/duco@ask-cs.com/"],"priority":"1","timeout":"3","type":"comment","state":"NEW","answers":null,"creationTime":"2012-09-24T10:15:17.660Z","module":"message","moduleId":null,"agent":"http://sven.ask-services.appspot.com/eveagents/personalagent/apptestknrm/","box":"outbox"},{"uuid":"cae5898c-a404-4b6e-a068-ac61d6e4edd3","subject":"koffie","question_text":"koffie staat klaar","requester":"http://sven.ask-services.appspot.com/eveagents/personalagent/beheer/","responder":["http://sven.ask-services.appspot.com/eveagents/personalagent/apptestknrm/"],"priority":"1","timeout":"3","type":"comment","state":"SEEN","answers":null,"creationTime":"2012-09-14T07:50:29.797Z","module":"message","moduleId":null,"agent":"http://sven.ask-services.appspot.com/eveagents/personalagent/apptestknrm/","box":"inbox"},{"uuid":"d9b53fa6-d52f-4a6f-896a-d5a73f007d75","subject":"testing eigen bericht","question_text":"het was een leuke weekend..","requester":"http://sven.ask-services.appspot.com/eveagents/personalagent/apptestknrm/","responder":["http://sven.ask-services.appspot.com/eveagents/personalagent/duco@ask-cs.com/"],"priority":"1","timeout":"3","type":"comment","state":"NEW","answers":null,"creationTime":"2012-09-24T09:32:52.422Z","module":"message","moduleId":null,"agent":"http://sven.ask-services.appspot.com/eveagents/personalagent/apptestknrm/","box":"outbox"},{"uuid":"dba57aef-5710-4cf7-9d77-b0322ba7d667","subject":"testje","question_text":"testje content","requester":"http://sven.ask-services.appspot.com/eveagents/personalagent/beheer/","responder":["http://sven.ask-services.appspot.com/eveagents/personalagent/apptestknrm/"],"priority":"1","timeout":"3","type":"comment","state":"SEEN","answers":null,"creationTime":"2012-09-13T15:18:42.768Z","module":"message","moduleId":null,"agent":"http://sven.ask-services.appspot.com/eveagents/personalagent/apptestknrm/","box":"inbox"}],
		
		"network": [{"name":"Schippers","resources":{"id":"f609041a-69b6-1030-a3ab-005056bc7e66","name":"Schippers"},"serviceCount":-1,"serviceID":"","type":"","uuid":"f609041a-69b6-1030-a3ab-005056bc7e66"},{"name":"Opstappers","resources":{"id":"a2408ffc-69b5-1030-a3ab-005056bc7e66","name":"Opstappers"},"serviceCount":-1,"serviceID":"","type":"","uuid":"a2408ffc-69b5-1030-a3ab-005056bc7e66"}],
		
		"slots": [{"count":0,"end":1350684000,"recursive":true,"start":1350647846,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"availability","wish":0},{"count":0,"end":1350770400,"recursive":true,"start":1350684000,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1350943200,"recursive":true,"start":1350770400,"text":"com.ask-cs.State.Available","type":"availability","wish":0},{"count":0,"end":1351029600,"recursive":true,"start":1350943200,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351116000,"recursive":true,"start":1351029600,"text":"com.ask-cs.State.KNRM.BeschikbaarNoord","type":"availability","wish":0},{"count":0,"end":1351202400,"recursive":true,"start":1351116000,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351288800,"recursive":true,"start":1351202400,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"availability","wish":0},{"count":0,"end":1351375200,"recursive":true,"start":1351288800,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351551600,"recursive":true,"start":1351375200,"text":"com.ask-cs.State.Available","type":"availability","wish":0},{"count":0,"end":1351638000,"recursive":true,"start":1351551600,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351724400,"recursive":true,"start":1351638000,"text":"com.ask-cs.State.KNRM.BeschikbaarNoord","type":"availability","wish":0},{"count":0,"end":1351810800,"recursive":true,"start":1351724400,"text":"com.ask-cs.State.Unavailable","type":"availability","wish":0},{"count":0,"end":1351857446,"recursive":true,"start":1351810800,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"availability","wish":0},{"count":0,"end":1350680400,"recursive":false,"start":1350640800,"text":"com.ask-cs.State.Available","type":"","wish":0},{"count":0,"end":1350684000,"recursive":false,"start":1350680400,"text":"com.ask-cs.State.KNRM.BeschikbaarZuid","type":"","wish":0},{"count":0,"end":1350770400,"recursive":false,"start":1350684000,"text":"com.ask-cs.State.Unavailable","type":"","wish":0},{"count":0,"end":1350856800,"recursive":false,"start":1350770400,"text":"com.ask-cs.State.Available","type":"","wish":0}],
		
		"f609041a-69b6-1030-a3ab-005056bc7e66": [{"diff":1, "end":1350658800, "start":1350647846, "wish":1},{"diff":0, "end":1350684000, "start":1350658800, "wish":1},{"diff":-1, "end":1350770400, "start":1350684000, "wish":1},{"diff":0, "end":1350943200, "start":1350770400, "wish":1},{"diff":-1, "end":1351029600, "start":1350943200, "wish":1},{"diff":0, "end":1351116000, "start":1351029600, "wish":1},{"diff":-1, "end":1351202400, "start":1351116000, "wish":1},{"diff":0, "end":1351288800, "start":1351202400, "wish":1},{"diff":-1, "end":1351375200, "start":1351288800, "wish":1},{"diff":0, "end":1351551600, "start":1351375200, "wish":1},{"diff":-1, "end":1351576800, "start":1351551600, "wish":1},{"diff":0, "end":1351638000, "start":1351576800, "wish":1},{"diff":1, "end":1351724400, "start":1351638000, "wish":1},{"diff":0, "end":1351810800, "start":1351724400, "wish":1},{"diff":1, "end":1351857446, "start":1351810800, "wish":1}],
		
		"members": [{"config":{},"name":"apptest  knrm","personalAgentUrl":"http://sven.ask-services.appspot.com/eveagents/personalagent/apptestknrm/","rate":1.0,"resources":{"id":"apptestknrm","name":"apptest  knrm","EmailAddress":"dferro@ask-cs.com","PhoneAddress":"+31627033823"},"state":"com.ask-cs.State.NoPlanning","uuid":"apptestknrm"},{"config":{},"name":"Rolph  2 Herks","personalAgentUrl":"http://sven.ask-services.appspot.com/eveagents/personalagent/4173herks/","rate":1.0,"resources":{"id":"4173herks","name":"Rolph  2 Herks","PhoneAddress":"+31611225522"},"state":"com.ask-cs.State.NoPlanning","uuid":"4173herks"},{"config":{},"name":"Floris  1Visser","personalAgentUrl":"http://sven.ask-services.appspot.com/eveagents/personalagent/4056visser/","rate":1.0,"resources":{"id":"4056visser","name":"Floris  1Visser","PhoneAddress":"+31613573885"},"state":"com.ask-cs.State.NoPlanning","uuid":"4056visser"},{"config":{},"name":"Remco  2Verwaal","personalAgentUrl":"http://sven.ask-services.appspot.com/eveagents/personalagent/4179verwaal/","rate":1.0,"resources":{"id":"4179verwaal","name":"Remco  2Verwaal","PhoneAddress":"+31652052024"},"state":"com.ask-cs.State.NoPlanning","uuid":"4179verwaal"},{"config":{},"name":"Johan  1Schouwenaar","personalAgentUrl":"http://sven.ask-services.appspot.com/eveagents/personalagent/4171schouwenaar/","rate":1.0,"resources":{"id":"4171schouwenaar","name":"Johan  1Schouwenaar","PhoneAddress":"+31620300692"},"state":"com.ask-cs.State.NoPlanning","uuid":"4171schouwenaar"},{"config":{},"name":"Erik  2 van den Oever","personalAgentUrl":"http://sven.ask-services.appspot.com/eveagents/personalagent/4057oever/","rate":1.0,"resources":{"id":"4057oever","name":"Erik  2 van den Oever","PhoneAddress":"+31653131607"},"state":"com.ask-cs.State.NoPlanning","uuid":"4057oever"},{"config":{},"name":"Robert  1 Herks","personalAgentUrl":"http://sven.ask-services.appspot.com/eveagents/personalagent/4129herks/","rate":1.0,"resources":{"id":"4129herks","name":"Robert  1 Herks","PhoneAddress":"+31625321827"},"state":"com.ask-cs.State.NoPlanning","uuid":"4129herks"},{"config":{},"name":"Jeroen  2Fok","personalAgentUrl":"http://sven.ask-services.appspot.com/eveagents/personalagent/4058fok/","rate":1.0,"resources":{"id":"4058fok","name":"Jeroen  2Fok","PhoneAddress":"+31653508293"},"state":"com.ask-cs.State.NoPlanning","uuid":"4058fok"}]
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}





