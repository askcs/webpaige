




/*
cache sequence
----------------------------------------
login -- done by an another page

resources
	
		network
		
			if network is empty make parent call
			
			save groups in localStorage
			
				start loop of groups
				
					get wishes
					
					get division mapping
						loop groups for agg. planning
						
					get user lists
						combine all unique users in one array
							get member slots
								seperate rows
								combined rows
					
		question
		
		network/searchPaigeUser
		
		get user slots
			seperate rows
			combined rows
			
*/




cache = function()
{
	this.defaults = {
		
	}
}









function emptyCache()
{
	// remove cache snippets and look for group caches
	if (webpaige.get('groups'))
	{
		$.each(webpaige.get('groups'), function(index, group)
		{
			localStorage.removeItem(group.uuid);
		});		
	}
	// remove others	
	//localStorage.removeItem('rresources');
	localStorage.removeItem('messages');
	localStorage.removeItem('groups');
	localStorage.removeItem('contacts');
	localStorage.removeItem('aggs');
	localStorage.removeItem('wishes');
	localStorage.removeItem('slots');
}



function loadCache()
{																							  		
	window.app = {};
	for (var i in localStorage)
	{
		var tmp = {};
		tmp[i] = localStorage[i];
		$.extend( window.app, tmp );		
	}
	editor.set(window.app);
}



function seriousCache()
{
	var host='http://localhost:9000/ns_knrm';
	
	$.ajaxSetup({
    contentType: 'application/json',
    xhrFields: { 
    	withCredentials: true
    }		
	})
	
	async.parallel(
	{
	
    network: function(register)
    {
      setTimeout(function()
      {
      	$.ajax(
      	{
      		url: host + '/network'
      	})
      	.always(function(data)
      	{
      		register(null, arguments);
      		subajax();
      	});
      	
      }, 100);
    }
    
	},
	
	function(err, results)
	{
		console.log(results);
	});
}

function subajax()
{
	var host='http://localhost:9000/ns_knrm';
	
	$.ajaxSetup({
    contentType: 'application/json',
    xhrFields: { 
    	withCredentials: true
    }		
	})
	
	async.parallel(
	{
	
    resources: function(register)
    {
      setTimeout(function()
      {
      	$.ajax(
      	{
      		url: host + '/resources'
      	})
      	.always(function(data)
      	{
      		register(null, arguments);
      	});
      	
      }, 100);
    },
	
    question: function(register)
    {
      setTimeout(function()
      {
      	$.ajax(
      	{
      		url: host + '/question',
      	})
      	.always(function(data)
      	{
      		register(null, arguments);
      	});
      	
      }, 200);
    }
    
	},
	
	function(err, results)
	{
		console.log(results);
	});
}










			    
function getResources()
{
  webpaige.con(
	  options = {
	    path: '/resources',
	    loading: 'Loading resources..',
	    label: 'resources',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	  	editor.set(data);
	  }
  )
}


function getSlots()
{
	var resources = JSON.parse(webpaige.get('resources'));
  var trange = webpaige.config('trange');
  range = 'start=' + trange.bstart + '&end=' + trange.bend;
  webpaige.con(
	  options = {
	    path: '/askatars/' + resources.uuid + '/slots?' + range,
	    loading: 'Loading user slots..',
	    label: 'c_slots',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	  	editor.set(data);
	  }
  )
}




function getContacts()
{
  var query = '{"key":""}';
  webpaige.con(
  options = {
	    type: 'post',
	    path: '/network/searchPaigeUser',
	    json: query,
	    loading: 'Searching contacts in network..',
	    label: 'c_contacts',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	  	editor.set(data);
	  }
  )
}

function getMessages()
{
  webpaige.con(
	  options = {
	    path: '/question',
	    loading: 'Loading messages..',
	    label: 'c_messages',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	  	editor.set(data);
	  }
  )
}

function getGroups()
{
  webpaige.con(
	  options = {
	    path: '/network',
	    loading: 'Loading groups..',
	    label: 'c_groups',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	  	console.log(data);
	  	editor.set(data);
	  }
  )
}

















function escalate()
{
	var manifest = {
		1: {
			friendly: 'Resources',
			url: ''
		},
		2: {
			friendly: 'Messages',
			url: ''
		},
		3: {
			friendly: 'Contacts',
			url: ''
		}
	}
}































function buildCache()
{
	// remove cache snippets and look for group caches
	emptyCache();
	
	// some parameters needed for some calls
  var trange = webpaige.config('trange');
  window.range = 'start=' + trange.bstart + '&end=' + trange.bend;
	var resources = webpaige.get('resources');
	window.uuid = resources.uuid;
	
	// load resources
  webpaige.con(
  	{
	    path: '/resources',
	    loading: 'Loading resources..',
	    label: 'resources',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	  	// set resources
	  	webpaige.set(label, data);
	  	
	  	// load user slots seperate
		  webpaige.con(
			  {
			    path: '/askatars/' + window.uuid + '/slots?' + window.range,
			    loading: 'Loading user slots..',
			    label: 'slots',
			    session: session.getSession()
			  },
			  function (data, label)
			  {
		  		// save slots seperate							
		  		var tmp = {};												
		  		tmp[window.uuid] = { separate: data };
		  		webpaige.set('slots', tmp);	
	  	
			  	// load user slots combined
				  webpaige.con(
					  {
					    path: '/askatars/' + window.uuid + '/slots?' + window.range + '&type=both',
					    loading: 'Loading user slots (combined)..',
					    label: 'slots',
					    session: session.getSession()
					  },
					  function (data, label)
					  {
			      	// save user slots combined			
			      	var slots = webpaige.get('slots');								
				  		var tmp = {};										
				  		tmp[window.uuid] = { combined: data };
				  		webpaige.set('slots', $.extend( true, slots, tmp ));										
							
							// search for contacts in the network
						  var query = '{"key":""}';
						  webpaige.con(
						  	{
							    type: 'post',
							    path: '/network/searchPaigeUser',
							    json: query,
							    loading: 'Searching contacts in network..',
							    label: 'contacts',
							    session: session.getSession()
							  },
							  function (data, label)
							  {
							  	// save contacts in cache
								  webpaige.set(label, data);
								  
								  // load messages
								  webpaige.con(
									  {
									    path: '/question',
									    loading: 'Loading messages..',
									    label: 'messages',
									    session: session.getSession()
									  },
									  function (data, label)
									  {
									  	// save messages
										  webpaige.set(label, data);
										  
										  // load groups
										  webpaige.con(
											  {
											    path: '/network',
											    loading: 'Loading groups..',
											    label: 'groups',
											    session: session.getSession()
											  },
											  function (data, label)
											  {
											  	// save groups
											  	webpaige.set(label, data);
												  		
										  		// init localStorage groups
										  		webpaige.set('wishes', '');
										  		webpaige.set('aggs', '');
											  	
											  	// loop groups
											  	$.each(data, 
											  	function (index, group)
												  	{
												  		// save individual groups
												  		webpaige.set(group.uuid, {name: group.name});
												  	
												  		// load wishes of individual group
												      webpaige.con(
													      {
													        path: '/network/' + group.uuid + '/wish?' + window.range,
													        loading: 'Loading wishes for ' + group.name + ' ..',
													        label: group,
													        session: session.getSession()
													      },
													      function (data, group)
													      {
													      	// save wishes for that group
													      	var wishes = webpaige.get('wishes');								
														  		var tmp = {};										
														  		tmp[group.uuid] = data;
														  		webpaige.set('wishes', $.extend( wishes, tmp ));	
														  		
														  		// load group agg. values of that group
														      webpaige.con(
																	  {
																	    path: '/calc_planning/' + group.uuid + '?' + window.range,
																	    loading: 'Loading aggs for ' + group.name + ' ..',
																	    label: group,
																	    session: session.getSession()
																	  },
															      function (data, group)
															      {
															      	// save group agg. data of that group
															      	var aggs = webpaige.get('aggs');								
																  		var tmp = {};										
																  		tmp[group.uuid] = data;
																  		webpaige.set('aggs', $.extend( aggs, tmp ));	
															      	
															      	// load members of that group
																      webpaige.con(
																			  {
																			    path: '/network/' + group.uuid + '/members',
																			    loading: 'Loading members for ' + group.name + ' ..',
																			    label: group,
																			    session: session.getSession()
																			  },
																	      function (data, group)
																	      {
																	      	// save member list in that group
																	      	webpaige.set(group.uuid, $.extend( webpaige.get(group.uuid), { members: data } ));
																	      	
																	      	// loop members
																	      	$.each(data, 
																	      	function (index, member)
																		      	{
																					  	// load user slots seperate
																						  webpaige.con(
																							  {
																							    path: '/askatars/' + member.uuid + '/slots?' + window.range,
																							    loading: 'Loading ' + member.name + ' slots..',
																							    label: member,
																							    session: session.getSession()
																							  },
																							  function (data, member)
																							  {
																						  		// save slots seperate
																					      	var slots = webpaige.get('slots');								
																						  		var tmp = {};										
																						  		tmp[member.uuid] = { seperate: data };
																						  		webpaige.set('slots', $.extend( true, slots, tmp ));
																						  		
																						  		
																							  	// load user slots seperate
																								  webpaige.con(
																									  {
																									    path: '/askatars/' + member.uuid + '/slots?' + window.range + '&type=both',
																									    loading: 'Loading ' + member.name + ' slots..',
																									    label: member,
																									    session: session.getSession()
																									  },
																									  function (data, member)
																									  {
																								  		// save slots seperate
																							      	var slots = webpaige.get('slots');								
																								  		var tmp = {};										
																								  		tmp[member.uuid] = { combined: data };
																								  		webpaige.set('slots', $.extend( true, slots, tmp ));
																								  	}
																								  ) // member seperate slots
																						  
																						  
																						  	}
																						  ) // member seperate slots
																		      	}
																	      	) // each member
																	      	
																	      }
																      ) //members
																      
															      }
															    ) //aggs
															    
													      }
												      ) //wishes
												      
												  	}
											  	) //each groups
											  	
											  }
										  ) //groups
										  
									  }
								  ) //messages
								  
							  }
						  ) //contacts
						  
					  }
				  ) //slots combined
				  
			  }
		  ) //slots seperate
		  
	  }
  ) //resources
  
}

