'use strict';
/* Dashboard controller */

var dashboardCtrl = function($scope)
{	
  $scope.preventDeepLink();

	$scope.validLogin = true;



	$('a[href=#dashboard]').parent().addClass('active');
	$('a[href=#messages]').parent().removeClass('active');
	$('a[href=#groups]').parent().removeClass('active');



  var root = $scope.$parent.$parent;

  if (!localStorage.getItem('slots') &&
      !localStorage.getItem('wishes') &&
      !localStorage.getItem('aggs'))
  {
    this.register( 'planboard', this.render );
  }
  else
  {
    this.render(root);
  }
  
  this.callbacks = {};

  var that = this;
  setInterval(function() { that.sync.call( that ); }, config.data.planboard.sync);

	if ( $scope.fetchPlanboards() )
    this.rerender;






}

dashboardCtrl.prototype = {

	constructor: dashboardCtrl,
	
	callbacks: {},


	
	register : function(key, callback)
	{
		if (!this.callbacks[key])
		{
			this.callbacks[key] = [];
		}
		this.callbacks[key].push(callback);
	},



	
	rerender: function()
	{
    $scope.planboardLoading = false;
		console.log('switched back to dashboard. ready for processing.');		
	},



	
	render: function()
	{
		var timedata = [];
		
		var slots = JSON.parse(localStorage.getItem('slots'));
		
		$.each(slots, function(name, member)
		{	
			$.each(member.both, function(index2, slot)
			{
				timedata.push({
					start: Math.round(slot.start * 1000),
					end: Math.round(slot.end * 1000),
					group: name,
					content: slot.text,
					className: states[slot.text].className,
					editable: true
				})	
			})
		})
		
		window.app.timedata = timedata;
		
		// sorter comes here in play?
	
	  // TODO
    // optimize
	  var timeline;
	  timeline = new links.Timeline( document.getElementById('mytimeline') );
	  timeline.draw(timedata, config.timeline.options);
		
	},
	





	sync: function(root)
	{	
		// TODO: work on this !!	
		var that = this;	
		
		var url = 'planboard';
		
		var cb = that.callbacks[url];
		if (cb)
		{
			$.each(cb, function(k, v)
			{
				v.apply(this, arguments);
			})
		}
		
		async.series({
		    
	    parent: function(callback)
	    {
	    var url = host + '/parent';
	      setTimeout(function()
	      {
	      	
				  $.ajax(
					{
						url: url,
					})
					.success(
					function(data)
					{
					
						//
						// core callback registerer			
						var cb = that.callbacks[url];
						if (cb)
						{
							$.each(cb, function(k, v)
							{
								v.apply(this, arguments);
							});
		    		}
		    		// end callback registerer
		    		//
		    		
		    		
		    		callback(null, 'done');
					})
					.fail(function()
					{
					})
	      }, 200);
	    },
	    
		},
		function(err, results)
		{
			//console.log('results of parallel calls: ', results);
		})
		
	}







}
//)

dashboardCtrl.$inject = ['$scope'];