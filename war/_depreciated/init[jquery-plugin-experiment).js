!function ($) {

  "use strict";

/*
  var Webpaige = function (element, options)
  {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.webpaige.defaults, options)
  }
*/

  $.fn.webpaige = function (options)
  {
	  this.defaults = {
	  	host: host,
	  	path: null,
	  	json: null,
	  	type: 'get',
	  	//session: session,
	  	session: '6ae2d6e8b89bb894162d960dce5791b0de3ca6bf1e8372d97e5da085b7ad967d',
	  	credentials: true,
	  	loading: 'Laden..',
	  	message: 'Succes!',
	  	label: 'not_labeled',
	  	400: null,
	  };  
    this.options = $.extend({}, $.fn.webpaige.defaults, options);
    return new Webpaige(options)
  }


/*
	webpaige = function()
	{
	  this.options = {
	  	host: host,
	  	path: null,
	  	json: null,
	  	type: 'get',
	  	//session: session,
	  	session: '6ae2d6e8b89bb894162d960dce5791b0de3ca6bf1e8372d97e5da085b7ad967d',
	  	credentials: true,
	  	loading: 'Laden..',
	  	message: 'Succes!',
	  	label: 'not_labeled',
	  	400: null,
	  };  
		window.data = [];
	}
*/
	
	
	$.fn.webpaige.get = function(label)
	{
		return localStorage.getItem(label);
	}
	
	
	$.fn.webpaige.set = function(label, data)
	{
		window.data[label] = data;
		localStorage.setItem(label, data);
	}
	
	
	$.fn.webpaige.config = function(key, value)
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
	
	
	$.fn.webpaige.remove = function(label)
	{
		localStorage.removeItem(label);
	}
	
	
	$.fn.webpaige.clear = function(label)
	{
		localStorage.clear();
	}
	
	
	$.fn.webpaige.con = function(options, callback)
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
	
	
	$.fn.webpaige.stats = function(loading)
	{
		$('#loading').remove();
		var loading = '<div id="loading"><img alt="Loading" src="img/ajax-loader-snake.gif"><span id="loading">' + loading + '</span></div>';
		$('#status').append(loading);
		$('#status').show();
	}
	
	
	$.fn.webpaige.loaded = function()
	{
		$('#status').hide();
	}
	
	
	$.fn.webpaige.message = function(message)
	{
		$('#message').remove();
		$('#alert').append('<div id="message">Success! ' + message + "</div>");
		$('#alert').show();
		$('#alert').delay(900).fadeOut(400);
	}
	
	
	$.fn.webpaige.alert = function(message)
	{
		$('#message').remove();
		$('#alert').append('<div id="message">Error! ' + message + "</div>");
		$('#alert').show();
		$('#alert').delay(900).fadeOut(400);
	}
	
	
	$.fn.webpaige.logout = function()
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
	
	
	$.fn.webpaige.getRole = function()
	{
		return webpaige.config('userRole');		
	}
	
	
	$.fn.webpaige.inited = function(element)
	{
		console.log('webpaige inited');
	}

}(window.jQuery);














