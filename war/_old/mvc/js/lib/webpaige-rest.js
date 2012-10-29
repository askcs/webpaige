var Connect = function(options) 
{
  this.options = {
  	path: null,
  	json: null,
  	type: 'get',
  	//session: session,
  	session: '9ab78e531309ba70e7311737c280e5456f6b2e817b24eae00a9b7104fe2b5469',
  	credentials: true
  };
};

_.extend(Connect.prototype, 
{
	fetch: function()
	{
		this.webpaige.connect({
			path: 'question'
		},
		function(data) { present(data) }
		);
	},
	
	present: function(data)
	{
		return data;
	},
	
  connect: function(options, callback)
  {
		options = $.extend({}, this.options, options);
		//$('#loader').text(options.loading);
	  $.ajax(
	  {
	    url: window.app.Config.rest.host + options.path,
		  type: options.type,
			data: options.json,
	    beforeSend: function(xhr)
	    {
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
	    	//$('#loader').text(options.loaded);
      	(data && typeof data == 'string' && data != 'ok') ? data = JSON.parse(data) : data;
	    	callback(data);
	    },
	    error: function(jqXHR, exception, options)
	    {
	      if (jqXHR.status === 0)
	      {
	      	//$('#loader').text('Not connected to internet. Verify Network.');
	      }
	      else if (jqXHR.status == 400)
	      {
	      	//$('#loader').text('Bad request. [400]');
	      }
	      else if (jqXHR.status == 404)
	      {
	        //$('#loader').text('Requested page not found. [404]');
	      }
	      else if (jqXHR.status == 500)
	      {
	       	//$('#loader').text('Internal server error. [500]');
	      }
	      else if (exception === 'parser error')
	      {
	        //$('#loader').text('Requested JSON parse failed.');
	      }
	      else if (exception === 'timeout')
	      {
	        //$('#loader').text('Time out error.');
	      }
	      else if (exception === 'abort')
	      {
	        //$('#loader').text('Ajax request aborted.');
	      }
	      else
	      {
	        //$('#loader').text('Uncaught Error. ' + jqXHR.responseText);
	      }
	    }
	  });
  }
});