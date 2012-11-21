			    
function getResources()
{
  webpaige.con(
	  options = {
	    path: '/resources',
	    loading: 'Loading resources..',
	    label: 'c_resources',
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



























function buildCache()
{
	// remove cache snippets
	// look for group caches
	if (webpaige.get('groups'))
	{
		$.each(webpaige.get('groups'), function(index, group)
		{
			localStorage.removeItem(group.uuid);
		});		
	}
	// remove others	
	localStorage.removeItem('rresources');
	localStorage.removeItem('messages');
	localStorage.removeItem('slots');
	localStorage.removeItem('groups');
	localStorage.removeItem('contacts');
	
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
	    label: 'rresources',
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	  	// set resources
	  	webpaige.set(label, data);
	  	
	  	// load user slots
		  webpaige.con(
			  {
			    path: '/askatars/' + window.uuid + '/slots?' + window.range,
			    loading: 'Loading user slots..',
			    label: 'slots',
			    session: session.getSession()
			  },
			  function (data, label)
			  {
			  	// set user slots
					webpaige.set(label, data);
					
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
									  	
									  	// loop groups
									  	$.each(data, function (index, group)
									  	{
									  		// save individual groups
									  		webpaige.set(group.uuid, {
										  		name: group.name
									  		});
									  	
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
									      	var cache = webpaige.get(group.uuid);
										  		webpaige.set(group.uuid, $.extend(cache, {wishes: data}));
										  		
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
										      	var cache = webpaige.get(group.uuid);
										      	webpaige.set(group.uuid, $.extend(cache, {aggs: data}));
										      	
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
											      	var cache = webpaige.get(group.uuid);
											      	webpaige.set(group.uuid, $.extend(cache, {members: data}));
											      	
											      	
											      	
											      });
										      
										      
										      
										      });
									      
									      
									      });
									  	
									  	})
									  	
									  	//editor.set(webpaige.cacher('all'));
									  }
								  )
  
  
  
							  }
						  )
  
  
					  }
				  )
					
			  }
		  )
  
  
  
	  }
  )
}