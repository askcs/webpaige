$(document).ready(function()
{
	 	
 	var login = JSON.parse(webpaige.get('login'));
 	
 	if (login != null)
 	{
	  $('#username').val(login.user);
	  $('#remember').attr('checked', login.remember);
 	};
 	
  $("#alertClose").click(function()
  {
    $("#alertDiv").hide();
  });
  
  $("#loginBtn").click(function()
  {
  	
	  $("#ajaxLoader").show();
	  
	  var userDef = "Username";
	  var passDef = "password";
	  var user = $('#username').val();
	  var pass = $('#password').val();
	  var r = $('#remember:checked').val();
	  
	  if (user == '' || user == userDef)
	  {
	    $("#alertDiv").show();
	    $("#alertMessage").html('<strong>Login mislukt!</strong><br>Geen gebruikersnaam opgegeven.');
	    $("#ajaxLoader").hide();
	    return false;
	  }
	  
	  if (pass == '' || pass == passDef)
	  {
	    $("#alertDiv").show();
	    $("#alertMessage").html('<strong>Login mislukt!</strong><br>Geen wachtwoord opgegeven.');
	    $("#ajaxLoader").hide();
	    return false;
	  }
	  
	  loginAsk(user.toLowerCase(), MD5(pass), r);
  });
	
});





function loginAsk_(user, pass, r)
{
	webpaige.set('config', '{}');
}





function loginAsk2(user, pass, r)
{
	webpaige.set('config', '{}');
	
	
	// logging in ask
	webpaige.con(
		options = {
			path: '/login?uuid=' + user + '&pass=' + pass,
			loading: 'Inloggen..'
		},
		function(data, label)
	  {  	
      if (r != null)
      {
      	var login = {};
      	login.user = user;
      	login.remember = r;
      	webpaige.set('login', JSON.stringify(login));
      }
      else
      {
      	webpaige.remove('login');
      }
      
      session.setSession(data["X-SESSION_ID"]);
      document.cookie = "sessionId=" + session;
      
      
      
      
      // loading resources
			webpaige.con(
				{
					path: '/resources',
					loading: 'Persoonlijke gegevens aan het laden..',
					label: 'resources',
					session: session.getSession()	
				},
				function(data, label)
			  {  	
					webpaige.set(label, JSON.stringify(data));
					
					webpaige.config('userRole', data.role);					
					
					var trange = {};	
					
				  now = parseInt((new Date()).getTime() / 1000);
				  
				  trange.bstart = (now - 86400 * 7 * 1);
				  trange.bend = (now + 86400 * 7 * 1);					
					
				  trange.start = new Date();
				  trange.start = Date.today().add({ days: -5 });
				  trange.end = new Date();
				  trange.end = Date.today().add({ days: 5 });
				  
				  webpaige.config('trange', trange);	
				  webpaige.config('treset', trange);		
							
		      var url = (data.role < 3) ? '/network' : '/parent';
					
					webpaige.con(
						{
							path: url,
							loading: 'Groep & contacten informatie aan het laden..',
							label: 'groups'
							,session: session.getSession()	
						},
						function(data, label)
					  { 
						  for(var i in data)
						  {
						  	if (i == 0)
						  	{
						  		webpaige.config('firstGroupUUID', data[i].uuid);
						  		webpaige.config('firstGroupName', data[i].name);
						  	}	 	    
						  }
							
							//document.location = "index.html#/dashboard";
						}
					);
					
 	
				}
			);
		}
	);
}







function saveCookie(data)
{
	session.setSession(data["X-SESSION_ID"]);
	document.cookie = "sessionId=" + session;
}





function saveUser(user, r)
{
	if (r != null)
	{
		webpaige.set('login', JSON.stringify({
	  	user: user,
	  	remember: r
		}));
	}
	else
	{
		webpaige.remove('login');
	}
}






function loginAsk(user, pass, r)
{
	//reset config
	webpaige.set('config', '{}');
	
	//set host
	//var host = 'http://localhost:9000/ns_knrm';
	var host = 'http://3rc2.ask-services.appspot.com/ns_knrm';
	
	// generic ajax settings
	$.ajaxSetup(
	{
    contentType: 'application/json',
    xhrFields: { 
    	withCredentials: true
    }		
	})
	
	async.waterfall([
    function(callback)
    {
		  $.ajax(
			{
				url: host + '/login?uuid=' + user + '&pass=' + pass,
			})
			.success(
			function(data)
			{
	      saveUser(user, r);
	      saveCookie(data);
    		callback(null, data["X-SESSION_ID"]);
			})
    },
    function(session, callback)
    {
		  $.ajax(
			{
				url: host + '/resources',
			})
			.success(
			function(user)
			{			
				setupRanges();					      
    		callback(null, user);
			})
    },
    function(path, callback)
    {
    	async.parallel({
		    network: function(callback)
		    {
	        setTimeout(function()
	        {
					  $.ajax(
						{
							url: host + '/network',
						})
						.success(
						function(data)
						{				
			    		callback(null, 'done');
						})
	        }, 300);
		    },
		    parent: function(callback)
		    {
	        setTimeout(function()
	        {
					  $.ajax(
						{
							url: host + '/parent',
						})
						.success(
						function(data)
						{				
			    		callback(null, 'done');
						})
	        }, 200);
		    },
		    messages: function(callback)
		    {
	        setTimeout(function()
	        {
					  $.ajax(
						{
							url: host + '/question?0=dm',
						})
						.success(
						function(data)
						{				
			    		callback(null, 'done');
						})
	        }, 100);
		    },
			},
			function(err, results)
			{
				console.log('results of parallel calls: ', results); 
			});	
			
    }
	], function (err, results)
	{
		console.log('results of main calls: ', results);   
	});
}




var calls = {

  login: {
    status: true,
    traverse: {
    
      resources: {
        status: true,
        traverse: {
        
          network: {
            status: true,
            traverse: {}
          },
        
          parent: {
            status: true,
            traverse: {}
          },
          
          messages: {
            status: true,
            traverse: {}
          }
          
        }
      }
      
    }
  }
  
}


function setupRanges()
{				
	var trange = {};	
	
  now = parseInt((new Date()).getTime() / 1000);
  
  trange.bstart = (now - 86400 * 7 * 1);
  trange.bend = (now + 86400 * 7 * 1);					
	
  trange.start = new Date();
  trange.start = Date.today().add({ days: -5 });
  trange.end = new Date();
  trange.end = Date.today().add({ days: 5 });
  
  console.log(trange);
  
  webpaige.config('trange', trange);	
  webpaige.config('treset', trange);
}






function asinker()
{
	var host = 'http://localhost:9000/ns_knrm';
	
	$.ajaxSetup(
	{
    contentType: 'application/json',
    xhrFields: { 
    	withCredentials: true
    }		
	})
	
	$.ajax(
	{
		url: host + '/resources',
	})
	.success(
	function(data)
	{
		//console.log(arguments);
	
		// second stage
		async.parallel(
		{
	    contacts: function(callback)
	    {
	      setTimeout(function()
	      {
	      	callback(null, true)
	      }, 100);
	    },
	    question: function(callback)
	    {
	      setTimeout(function()
	      {
	      	callback(null, true)	      	
	      }, 200);
	    },
	    network: function(callback)
	    {
	      setTimeout(function()
	      {
	      	callback(null, true)	      	
	      }, 300);
	    }
		},
		function(err, results)
		{
			console.log('first serie results', results);
			
			if (results.network)
			{				
				var groups = ['group1', 'group2', 'group3'];
				
				var pros = {},
				tmp = {};
				
				$.each(groups, function (index, group)
				{
					tmp[group] = function(callback, index)
					{
						setTimeout(function()
						{ 
							callback(null, true)
						}, (index * 100) + 100) 
					}					
					$.extend(pros, tmp)
				})
				
				async.parallel(pros,
				function(err, results)
				{
					console.log('escalate network', results);					
				});
			}
		});
	
	});

	//return true	
}






































